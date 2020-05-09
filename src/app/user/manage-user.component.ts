import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from '../admin/employee/employee';
import { EmployeeService } from '../admin/employee.service';
import { UserService } from '../services/user.service'
import { CustomValidators } from '../services/custom_validators';
import { FormService } from '../services/form';
import { DataService } from '../admin/data.service';
import { NotificationService } from '../services/notification.service'

@Component({
  templateUrl: './manage-user.component.html'
})

export class ManageUserComponent implements OnInit {

  title = 'payroll-system';

  // Create de default constructor if possible.
  employee : any;// = new Employee('TestEmpCode', 'TestFirst', 'TestLast', '', '', '', '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '');
  user = {
    'id': null,
    'firstName' : '',
    'lastName' : '',
    'emailAddress' : '',
    'employee': null,
    'password' : '12345', // Temporary
    'is_system_admin' : false,
    'is_payroll_admin' : false,
    'is_employee_admin' : false,
    'is_employee' : false
  };

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;

  public formErrors = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    is_system_admin: '',
    is_payroll_admin: '',
    is_employee_admin: '',
    is_employee: ''
  };

  checkSysAdmin($isChecked): void {
    if ($isChecked) {
      this.user.is_system_admin = true;
    } else {
      this.user.is_system_admin = false;
    }
  }
  checkPayrollAdmin($isChecked): void {
    if ($isChecked) {
      this.user.is_payroll_admin = true;
    } else {
      this.user.is_payroll_admin = false;
    }
  }
  checkEmployeeAdmin($isChecked): void {
    if ($isChecked) {
      this.user.is_employee_admin = true;
    } else {
      this.user.is_employee_admin = false;
    }
  }
  checkEmployee($isChecked): void {
    if ($isChecked) {
      this.user.is_employee = true;
    } else {
      this.user.is_employee = false;
    }
  }

  constructor(private employeeService: EmployeeService,
              private userService: UserService,
              private dataService: DataService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private location: Location,
              private notification: NotificationService,
              public formService: FormService) { // TRY PRIVATE

    this.rForm = fb.group({
      firstName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
      lastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50), CustomValidators.validateCharacters]],
      emailAddress: [null, [Validators.required, Validators.email]],
      is_system_admin: [null],
      is_payroll_admin: [null],
      is_employee_admin: [null],
      is_employee: [null]
    });

    // on each value change we call the validateForm function
    // We only validate form controls that are dirty, meaning they are touched
    // the result is passed to the formErrors object
    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  ngOnInit() {
    this.getEmployeeToEdit();
  }

  getEmployeeToEdit(): void { // to add/edit user
    const id = +this.route.snapshot.paramMap.get('id');//add
    const _id = +this.route.snapshot.paramMap.get('_id');//edit
    if (id>0){
      this.updateMode = false;
      this.populateForm(id);
      //this.userEdit(id);
    } else if (_id>0) {
      this.updateMode = true;
      this.populateFormToEdit(_id);
    }
  }

  goBack(): void {
    this.location.back();
  }

  getEmployee(id): void {
    this.employeeService.getEmployee(id).subscribe(
      (res: Employee) => {
        this.employee = res;
      }
    );
  }

  addUser(f) {
    this.user.firstName = f.firstName;
    this.user.lastName = f.lastName;
    this.user.emailAddress = f.emailAddress;
    this.user.employee = this.employee.id;
    // though they're also updated on class level:
    this.user.is_employee = (f.is_employee) ? true:false;
    this.user.is_employee_admin = (f.is_employee_admin) ? true:false;
    this.user.is_payroll_admin = (f.is_payroll_admin) ? true:false;
    this.user.is_system_admin = (f.is_system_admin) ? true:false;
    this.userService.create(this.user)
      .subscribe(
        (res: any) => {
          if (res) {
            this.notification.showSaved();
          }
          // Reset the form
          this.rForm.reset();
        }
      );
  }

  updateUser(f) {
    // Find a way to log out that user to force his token refresh or maybe wait for token refresh? latter is better.
    // This is a partial update. no need to put all fields
    this.user.is_employee = f.is_employee;
    this.user.is_employee_admin = f.is_employee_admin;
    this.user.is_payroll_admin = f.is_payroll_admin;
    this.user.is_system_admin = f.is_system_admin;
    this.userService.updateUser(this.user)
      .subscribe(
        (res) => {
          this.notification.showSaved();
        }
      );
  }

  populateForm(id){
    this.employeeService.getEmployee(id).subscribe(
      (res: any) => {
        this.employee = res;
        this.rForm.setValue({
          firstName: this.employee.firstName,
          lastName: this.employee.lastName,
          emailAddress: this.employee.emailAddress,
          is_system_admin: null,
          is_payroll_admin: null,
          is_employee_admin: null,
          is_employee: true // set to true by default.
        });
      }
    );
  }

  populateFormToEdit(id){
    this.userService.getUser(id).subscribe(
      (res: any) => {
        this.user = res;
        this.rForm.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          emailAddress: this.user.emailAddress,
          is_system_admin: this.user.is_system_admin,
          is_payroll_admin: this.user.is_payroll_admin,
          is_employee_admin: this.user.is_employee_admin,
          is_employee: this.user.is_employee
          //is_system_admin.setValue( true )
        });
      }
    );
  }

  /*updateEmployee(partialEmployee) {
    this.employeeService.updatePartial(partialEmployee)
      .subscribe(
        (res) => {
          // No need to notify here
        },
        (err) => {
          this.notification.showError('Seems the user reference was not updated on the employee table.\n Double check and delete user then recreate if necessary!');
        }
      );
    window.scroll(0, 0);
  }*/

  deleteUser(id) {
    this.userService.deleteUser(id)
      .subscribe(
        (res: boolean) => {
          this.notification.showDeleted();
        }
      );
    this.user = null;
    this.rForm.reset();
  }
}
