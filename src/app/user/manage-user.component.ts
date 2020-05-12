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
import { NotificationService } from '../services/notification.service';
import { Role } from '../user/role';

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
    'email' : '',
    'username' : '',
    'employee': null,
    'password' : '12345', // Temporary
    'role' : []
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
  
stripRole(role) {
  return role.replace('ROLE_','');
}

  /* These role sets do not get triggered on updatemode - only on create mode*/
 checkSysAdmin($isChecked): void {
  if(!this.updateMode) {
    if ($isChecked) {
      this.user.role = this.dataService.addToArray(this.user.role, this.stripRole(Role.ROLE_ADMIN));
    } else {
      this.user.role = this.user.role.filter(item => item !== this.stripRole(Role.ROLE_ADMIN));
    }
  }
}
checkPayrollAdmin($isChecked): void {
  if(!this.updateMode) {
    if ($isChecked) {
      this.user.role = this.dataService.addToArray(this.user.role, this.stripRole(Role.ROLE_PAYROLL_ADMIN));
    } else {
      this.user.role = this.user.role.filter(item => item !== this.stripRole(Role.ROLE_PAYROLL_ADMIN));
    }
  }
}
checkEmployeeAdmin($isChecked): void {
  if(!this.updateMode) {
    if ($isChecked) {
      this.user.role = this.dataService.addToArray(this.user.role, this.stripRole(Role.ROLE_EMPLOYEE_ADMIN));
    } else {
      this.user.role = this.user.role.filter(item => item !== this.stripRole(Role.ROLE_EMPLOYEE_ADMIN));
    }
  }
}
checkEmployee($isChecked): void {
  if(!this.updateMode) {
    if ($isChecked) {
      this.user.role = this.dataService.addToArray(this.user.role, this.stripRole(Role.ROLE_EMPLOYEE));
    } else {
      this.user.role = this.user.role.filter(item => item !== this.stripRole(Role.ROLE_EMPLOYEE));
    }
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
    this.user.email = f.emailAddress;
    this.user.username = f.emailAddress;
    this.user.employee = this.dataService.generateQuickIdObject(this.employee.id);
  
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
    this.user.employee = this.dataService.generateQuickIdObject(this.user.employee.id);
    this.user.role = this.getEditedRoles(f);
    this.userService.updateUser(this.user)
      .subscribe(
        (res) => {
          this.notification.showSaved();
        }
      );
  }

  getEditedRoles(f){
    /* role sets for updatemode */
    let rolesArr = [];
    if (f.is_system_admin) this.dataService.addToArray(rolesArr, this.stripRole(Role.ROLE_ADMIN));
    if (f.is_payroll_admin) this.dataService.addToArray(rolesArr, this.stripRole(Role.ROLE_PAYROLL_ADMIN));
    if (f.is_employee_admin) this.dataService.addToArray(rolesArr, this.stripRole(Role.ROLE_EMPLOYEE_ADMIN));
    if (f.is_employee) this.dataService.addToArray(rolesArr, this.stripRole(Role.ROLE_EMPLOYEE));
    return rolesArr;
  }

  populateForm(id){
    this.employeeService.getEmployee(id).subscribe(
      (res: any) => {
        //alert('populateForm(id)\n' + JSON.stringify(res));
        this.employee = res;
        this.rForm.setValue({
          firstName: this.employee.firstName,
          lastName: this.employee.lastName,
          emailAddress: this.employee.emailAddress,
          is_system_admin: null,
          is_payroll_admin: null,
          is_employee_admin: null,
          is_employee: null // set to true by default.
        });
      }
    );
  }

  populateFormToEdit(id){
    this.userService.getUser(id).subscribe(
      (res: any) => {
        this.user = res.result;
        this.rForm.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          emailAddress: this.user.email,
          is_system_admin: this.hasRole(this.user['roles'], this.stripRole(Role.ROLE_ADMIN)),
          is_payroll_admin: this.hasRole(this.user['roles'], this.stripRole(Role.ROLE_PAYROLL_ADMIN)),
          is_employee_admin: this.hasRole(this.user['roles'], this.stripRole(Role.ROLE_EMPLOYEE_ADMIN)),
          is_employee: this.hasRole(this.user['roles'], this.stripRole(Role.ROLE_EMPLOYEE))
        });
      }
    );
  }

  hasRole(Obj: any, role: string) {
    let s = Obj.find(r=>r.name == role);
    if(this.dataService.isObject(s)){
      if (s['name']==role) return true;//Second If is not needed
    }
    //return JSON.stringify(s);
    return false;
  }

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
