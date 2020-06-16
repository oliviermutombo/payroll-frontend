import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from './employee';
import { Salary} from '../salary/salary'; // For dropdown
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { ApiService } from 'src/app/admin/api.service';
import { Department } from '../department/department'; // For dropdown
import { Position } from '../position/position'; // For dropdown
import { UtilitiesService } from '../../services/utilities.service';
import * as globals from 'src/app/globals';

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
  employee = new Employee('', '', '', '', '', '', '', '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '');

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;                     // A property for our submitted form
  firstName = '';
  middleName = '';
  lastName = '';
  dob = '';
  idNumber = '';
  passportNumber = '';
  emailAddress = '';
  payGrade = 0;
  basicPay = 0;
  department = 0;
  position = '';
  taxNumber = '';
  hireDate = '';
  address1 = '';
  address2 = '';
  postalCode = '';
  country = '';
  phoneNumber = '';
  bankName = '';
  bankAccount = '';
  bankBranch = '';

  public formErrors = {
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    idNumber: '',
    passportNumber: '',
    emailAddress: '',
    payGrade: '',
    basicPay: '',
    department: '',
    position: '',
    taxNumber: '',
    hireDate: '',
    address1: '',
    address2: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    bankName: '',
    bankAccount: '',
    bankBranch: ''
  };

  constructor(private apiService: ApiService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private location: Location,
              private utilitiesService: UtilitiesService,
              public formService: FormService) { // TRY PRIVATE

    this.rForm = fb.group({
      firstName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
      middleName: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50), CustomValidators.validateCharacters]],
      dob: [null, [Validators.required, CustomValidators.DateOfBirth]],
      idNumber: [null, [Validators.minLength(13), Validators.maxLength(13)]],
      passportNumber: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      emailAddress: [null, [Validators.required, Validators.email]], // THIS FIELD WAS FORGOTTEN. CATER FOR IT.
      payGrade: [null, [Validators.required]],
      basicPay: [null, [CustomValidators.numberOrDecimal]],
      department: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      position: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      taxNumber: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      hireDate: [null, [Validators.required]],
      address1: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      address2: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      postalCode: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      country: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      phoneNumber: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankName: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankAccount: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankBranch: [null, [Validators.minLength(1), Validators.maxLength(50)]],
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
    const id = +this.utilitiesService.Decrypt(this.route.snapshot.paramMap.get('id'));
    if (id>0){
      this.updateMode = true;
        this.employeeEdit(id);
    }
  }

  getEmployees(): void {
    //this.employeeService.getAll().subscribe(
    this.apiService.getAll(globals.EMPLOYEE_ENDPOINT).subscribe(
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
    //this.employeeService.getAllSalaries().subscribe(
    this.apiService.getAll(globals.SALARY_ENDPOINT).subscribe(
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
    this.apiService.getAll(globals.DEPARTMENT_ENDPOINT).subscribe(
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
    this.apiService.getAll(globals.POSITION_ENDPOINT).subscribe(
      (res: Position[]) => {
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
    //this.employeeService.getEmployee(id).subscribe(
    this.apiService.getById(globals.EMPLOYEE_ENDPOINT, id).subscribe(
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

    this.employee.empCode = Math.floor(Math.random() * 10001); // Temp random
    this.employee.firstName = f.firstName;
    this.employee.middleName = f.middleName;
    this.employee.lastName = f.lastName;
    this.employee.dob = f.dob;
    this.employee.idNumber = f.idNumber;
    this.employee.passportNumber = f.passportNumber;
    this.employee.emailAddress = f.emailAddress;
    this.employee.payGrade = this.utilitiesService.generateQuickIdObject(f.payGrade);//f.payGrade;
    this.employee.basicPay = f.basicPay;
    this.employee.department = this.utilitiesService.generateQuickIdObject(f.department);//f.department;
    this.employee.position = this.utilitiesService.generateQuickIdObject(f.position);//f.position;
    this.employee.taxNumber = f.taxNumber;
    this.employee.hireDate = f.hireDate;
    this.employee.address1 = f.address1;
    this.employee.address2 = f.address2;
    this.employee.postalCode = f.postalCode;
    this.employee.country = f.country;
    this.employee.phoneNumber = f.phoneNumber;
    this.employee.bankName = f.bankName;
    this.employee.bankAccount = f.bankAccount;
    this.employee.bankBranch = f.bankBranch;

    //this.employeeService.store(this.employee)
    this.apiService.saveOnly(globals.EMPLOYEE_ENDPOINT, this.employee)
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
    //this.employeeService.getEmployee(id).subscribe(
    this.apiService.getById(globals.EMPLOYEE_ENDPOINT, id).subscribe(
      (res: Employee) => {
        this.employee = res;
        this.rForm.setValue({
          firstName: this.employee.firstName,
          middleName: this.employee.middleName,
          lastName: this.employee.lastName,
          dob: this.employee.dob,
          idNumber: this.employee.idNumber,
          passportNumber: this.employee.passportNumber,
          emailAddress: this.employee.emailAddress,
          payGrade: (this.employee.payGrade != null) ? this.employee.payGrade.id : null, // very import otherwise null breaks things
          basicPay: this.employee.basicPay,
          department: (this.employee.department != null) ? this.employee.department.id : null, // very important to have the condition
          position: (this.employee.position != null) ? this.employee.position.id : null,
          taxNumber: this.employee.taxNumber,
          hireDate: this.employee.hireDate,
          address1: this.employee.address1,
          address2: this.employee.address2,
          postalCode: this.employee.postalCode,
          country: (this.employee.country != null) ? this.employee.country : null,//this.employee.country,
          phoneNumber: this.employee.phoneNumber,
          bankName: (this.employee.bankName != null) ? this.employee.bankName : null,//this.employee.bankName,
          bankAccount: (this.employee.bankAccount != null) ? this.employee.bankAccount : null,//this.employee.bankAccount,
          bankBranch: (this.employee.bankBranch != null) ? this.employee.bankBranch : null,//this.employee.bankBranch
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
    this.employee.firstName = f.firstName;
    this.employee.middleName = f.middleName;
    this.employee.lastName = f.lastName;
    this.employee.dob = f.dob;
    this.employee.idNumber = f.idNumber;
    this.employee.passportNumber = f.passportNumber;
    this.employee.emailAddress = f.emailAddress;
    this.employee.payGrade = this.utilitiesService.generateQuickIdObject(f.payGrade);//check behaviour when null
    this.employee.basicPay = f.basicPay;
    this.employee.department = this.utilitiesService.generateQuickIdObject(f.department);//check behaviour when null
    this.employee.position = this.utilitiesService.generateQuickIdObject(f.position);//check behaviour when null
    this.employee.taxNumber = f.taxNumber;
    this.employee.hireDate = f.hireDate;
    this.employee.address1 = f.address1;
    this.employee.address2 = f.address2;
    this.employee.postalCode = f.postalCode;
    this.employee.country = f.country;
    this.employee.phoneNumber = f.phoneNumber;
    this.employee.bankName = f.bankName;
    this.employee.bankAccount = f.bankAccount;
    this.employee.bankBranch = f.bankBranch;

    //this.employeeService.update(this.employee)
    this.apiService.updateOnly(globals.EMPLOYEE_ENDPOINT, this.employee)
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
    //this.employeeService.delete(id)
    this.apiService.deleteOnly(globals.EMPLOYEE_ENDPOINT, id)
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
