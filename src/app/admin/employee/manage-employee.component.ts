import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from './employee';
import { Salary} from '../salary/salary'; // For dropdown
import { EmployeeService } from '../employee.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { DataService } from '../data.service';
import { Department } from '../department/department'; // For dropdown
import { Position } from '../position/position'; // For dropdown

@Component({
  // selector: 'app-root', // WHAT MUST THE SELECTOR BE???
  selector: 'app-manage-employee',
  /*template: `
    <h3>Parent</h3>
    <h2>The master parent is sending is: {{master}}</h2>
    <app-employee-details 
      [betizparam] = "master">
    </app-employee-details>
  `,*/
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})

export class ManageEmployeeComponent implements OnInit {

  master = 'Message from parent'; // Test

  title = 'payroll-system';
  employees: Employee[];
  salaries: Salary[]; // For dropdown
  departments: Department[]; // For dropdown
  positions: Position[]; // For dropdown
  error = '';
  success = '';

  // Create de default constructor if possible.
  employee = new Employee('TestEmpCode', 'TestFirst', 'TestLast', '', '', '', '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '');

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;                     // A property for our submitted form
  firstname = '';
  surname = '';
  dob = '';
  idnumber = '';
  passportno = '';
  emailaddress = '';
  paygrade = 0;
  basicpay = 0;
  department = 0;
  position = '';
  taxnumber = '';
  hiredate = '';
  address1 = '';
  address2 = '';
  postalcode = '';
  country = '';
  phonenumber = '';
  bankname = '';
  bankaccount = '';
  bankbranch = '';

  public formErrors = {
    firstname: '',
    surname: '',
    dob: '',
    idnumber: '',
    passportno: '',
    emailaddress: '',
    paygrade: '',
    basicpay: '',
    department: '',
    position: '',
    taxnumber: '',
    hiredate: '',
    address1: '',
    address2: '',
    postalcode: '',
    country: '',
    phonenumber: '',
    bankname: '',
    bankaccount: '',
    bankbranch: ''
  };

  constructor(private employeeService: EmployeeService,
              private dataService: DataService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private location: Location,
              public formService: FormService) { // TRY PRIVATE

    this.rForm = fb.group({
      firstname: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
      surname: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50), CustomValidators.validateCharacters]],
      dob: [null, [Validators.required, CustomValidators.DateOfBirth]],
      idnumber: [null, [Validators.minLength(13), Validators.maxLength(13)]],
      passportno: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      emailaddress: [null, [Validators.required, Validators.email]], // THIS FIELD WAS FORGOTTEN. CATER FOR IT.
      paygrade: [null, [Validators.required]],
      basicpay: [null, [CustomValidators.numberOrDecimal]],
      department: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      position: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      taxnumber: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      hiredate: [null, [Validators.required]],
      address1: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      address2: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      postalcode: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      country: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      phonenumber: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankname: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankaccount: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankbranch: [null, [Validators.minLength(1), Validators.maxLength(50)]],
    });

    // on each value change we call the validateForm function
    // We only validate form controls that are dirty, meaning they are touched
    // the result is passed to the formErrors object
    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  ngOnInit() {
    this.getSalaries();
    this.getDepartments();
    this.getPositions();
    this.getEmployeeToEdit();
  }

  getEmployeeToEdit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if (id>0){
      this.updateMode = true;
        this.employeeEdit(id);
    }
  }

  getEmployees(): void {
    this.employeeService.getAll().subscribe(
      (res: Employee[]) => {
        this.employees = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  // below is for dropdown
  getSalaries(): void {
    this.employeeService.getAllSalaries().subscribe(
      (res: Salary[]) => {
        this.salaries = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }
  // for dropdown
  getDepartments(): void {
    this.dataService.getAllDepartments().subscribe(
      (res: Department[]) => {
        this.departments = res;
      },
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }
    );
  }

  // for dropdown
  getPositions(): void {
    this.dataService.getAllPositions().subscribe(
      (res: Position[]) => {
        // alert('Positions comp: ' + JSON.stringify(res));
        this.positions = res;
      },
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  getEmployee(id): void {
    this.employeeService.getEmployee(id).subscribe(
      (res: Employee) => {
        this.employee = res;
      },
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }
    );
  }

  addEmployee(f) {
    this.resetErrors();

    this.employee.empcode = Math.floor(Math.random() * 10001); // Temp random
    this.employee.firstname = f.firstname;
    this.employee.surname = f.surname;
    this.employee.dob = f.dob;
    this.employee.idnumber = f.idnumber;
    this.employee.passportno = f.passportno;
    this.employee.emailaddress = f.emailaddress;
    this.employee.paygrade = f.paygrade;
    this.employee.department = f.department;
    this.employee.position = f.position;
    this.employee.taxnumber = f.taxnumber;
    this.employee.hiredate = f.hiredate;
    this.employee.address1 = f.address1;
    this.employee.address2 = f.address2;
    this.employee.postalcode = f.postalcode;
    this.employee.country = f.country;
    this.employee.phonenumber = f.phonenumber;
    this.employee.bankname = f.bankname;
    this.employee.bankaccount = f.bankaccount;
    this.employee.bankbranch = f.bankbranch;

    this.employeeService.store(this.employee)
      .subscribe(
        (res: boolean) => {
          // Update the list of cars
          // this.employees = res;

          // Inform the user
          if (res) {
            this.success = 'Created successfully';
          } else {
            this.error = 'An error occured';
          }

          // Reset the form
          this.rForm.reset();
        },
        (err) => this.error = err
      );
      window.scroll(0, 0);
  }

  employeeEdit(id){
    this.employeeService.getEmployee(id).subscribe(
      (res: Employee) => {
        this.employee = res;
        this.rForm.setValue({
          firstname: this.employee.firstname,
          surname: this.employee.surname,
          dob: this.employee.dob,
          idnumber: this.employee.idnumber,
          passportno: this.employee.passportno,
          emailaddress: this.employee.emailaddress,
          paygrade: (this.employee.paygrade != null) ? this.employee.paygrade.id : null, // very import otherwise null breaks things
          basicpay: this.employee.basicpay,
          department: (this.employee.department != null) ? this.employee.department.id : null, // very important to have the condition
          position: (this.employee.position != null) ? this.employee.position.id : null,
          taxnumber: this.employee.taxnumber,
          hiredate: this.employee.hiredate,
          address1: this.employee.address1,
          address2: this.employee.address2,
          postalcode: this.employee.postalcode,
          country: this.employee.country,
          phonenumber: this.employee.phonenumber,
          bankname: this.employee.bankname,
          bankaccount: this.employee.bankaccount,
          bankbranch: this.employee.bankbranch
        });
      },
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }
    );
  }

  updateEmployee(f) {
    this.resetErrors();
    this.employee.firstname = f.firstname;
    this.employee.surname = f.surname;
    this.employee.dob = f.dob;
    this.employee.idnumber = f.idnumber;
    this.employee.passportno = f.passportno;
    this.employee.emailaddress = f.emailaddress;
    this.employee.paygrade = f.paygrade;
    this.employee.basicpay = f.basicpay;
    this.employee.department = f.department;
    this.employee.position = f.position;
    this.employee.taxnumber = f.taxnumber;
    this.employee.hiredate = f.hiredate;
    this.employee.address1 = f.address1;
    this.employee.address2 = f.address2;
    this.employee.postalcode = f.postalcode;
    this.employee.country = f.country;
    this.employee.phonenumber = f.phonenumber;
    this.employee.bankname = f.bankname;
    this.employee.bankaccount = f.bankaccount;
    this.employee.bankbranch = f.bankbranch;

    this.employeeService.update(this.employee)
      .subscribe(
        (res) => {
          // this.employees = res;
          this.success = 'Updated successfully';
        },
        (err) => this.error = err
      );
    window.scroll(0, 0);
  }

  deleteEmployee(id) {
    this.resetErrors();
    this.employeeService.delete(id)
      .subscribe(
        (res: boolean) => {
          // this.employees = res;
          this.success = 'Deleted successfully';
        },
        (err) => this.error = err
      );
  }

  private resetErrors() {
    this.success = '';
    this.error   = '';
  }
}
