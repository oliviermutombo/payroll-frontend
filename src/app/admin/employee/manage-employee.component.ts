import { Component, OnInit, ViewChild, QueryList, ViewChildren} from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material'; //REMOVE
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from './employee';
import { Salary} from '../salary/salary';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { ApiService } from 'src/app/admin/api.service';
import { Department } from '../department/department';
import { Position } from '../position/position';
import { UtilitiesService } from '../../services/utilities.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import * as globals from 'src/app/globals';
import { Country } from '../countries/country';
import { map, startWith, switchMap } from 'rxjs/operators';


//test

//

@Component({
  //selector: 'app-root', // WHAT MUST THE SELECTOR BE???
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})

export class ManageEmployeeComponent implements OnInit {

  master = 'Message from parent'; // Test

  title = 'payroll-system';
  employees: Employee[];

  //<Dropdown_Stuff>
  salaries: Observable<Salary[]>;
  filteredSalaries: Observable<Salary[]>;
  departments: Observable<Department[]>;
  filteredDepartments: Observable<Department[]>;
  positions: Observable<Position[]>;
  filteredPositions: Observable<Position[]>;
  countries: Observable<Country[]>;
  filteredCountries: Observable<Country[]> = new Observable<Country[]>();

  //</Dropdown_Stuff>

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
  
  @ViewChildren(MatAutocompleteTrigger) triggerCollection:  QueryList<MatAutocompleteTrigger>;
  subscription: Subscription;

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
    //<Dropdown_Stuff>
    this.getSalaries();
    this.filteredSalaries = this.thesalary.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterSalaries(value))
    );
    this.getDepartments();
    this.filteredDepartments = this.thedepartment.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterDepartments(value))
    );
    this.getPositions();
    this.filteredPositions = this.theposition.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterPositions(value))
    );
    this.getCountries();
    this.filteredCountries = this.thecountry.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterCountries(value))
    );
    //</Dropdown_Stuff>
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
          payGrade: (this.employee.payGrade != null) ? this.employee.payGrade : null, // very import otherwise null breaks things
          basicPay: this.employee.basicPay,
          department: (this.employee.department != null) ? this.employee.department : null, // very important to have the condition
          position: (this.employee.position != null) ? this.employee.position : null,
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

  //<Dropdown_Stuff>
  // below is for dropdown
  getSalaries(): void {
    this.salaries = this.apiService.getAll(globals.SALARY_ENDPOINT);
  }
  getDepartments(): void {
    this.departments = this.apiService.getAll(globals.DEPARTMENT_ENDPOINT);
  }
  getPositions(): void {
    this.positions = this.apiService.getAll(globals.POSITION_ENDPOINT);
  }
  getCountries(): void {
    this.countries = this.apiService.getAll(globals.COUNTRY_ENDPOINT);
  }
  ngAfterViewInit() {
    this._subscribeToClosingActions();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.triggerCollection.toArray()[0].panelClosingActions
      .subscribe(e => {
        if (!e || !e.source) {
          console.log(this.triggerCollection)
          console.log(e)
          this.rForm.controls.payGrade.setValue(null);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());

    this.subscription = this.triggerCollection.toArray()[1].panelClosingActions
    .subscribe(e => {
      if (!e || !e.source) {
        console.log(this.triggerCollection)
        console.log(e)
        this.rForm.controls.department.setValue(null);
      }
    },
    err => this._subscribeToClosingActions(),
    () => this._subscribeToClosingActions());

    this.subscription = this.triggerCollection.toArray()[2].panelClosingActions
    .subscribe(e => {
      if (!e || !e.source) {
        console.log(this.triggerCollection)
        console.log(e)
        this.rForm.controls.position.setValue(null);
      }
    },
    err => this._subscribeToClosingActions(),
    () => this._subscribeToClosingActions());

    this.subscription = this.triggerCollection.toArray()[3].panelClosingActions
    .subscribe(e => {
      if (!e || !e.source) {
        console.log(this.triggerCollection)
        console.log(e)
        this.rForm.controls.country.setValue(null);
      }
    },
    err => this._subscribeToClosingActions(),
    () => this._subscribeToClosingActions());
  }

  private filterSalaries(value: string | Salary) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.payGrade.toLowerCase();
      return this.salaries.pipe(
        map(salaries => salaries.filter(salary => salary.payGrade.toLowerCase().includes(filterValue) || salary.basicPay.toString().toLowerCase().includes(filterValue)))
      );
    } else {
      return this.salaries;
    }
  }
  displaySalaryFn(salary?: Salary): string | undefined {
    return salary ? salary.payGrade + ' (Basic pay: R' + salary.basicPay + ')' : undefined;
  }

  private filterDepartments(value: string | Department) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
      return this.departments.pipe(
        map(departments => departments.filter(department => department.name.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.departments;
    }
  }
  displayDepartmentFn(department?: Department): string | undefined {
    return department ? department.name : undefined;
  }

  private filterPositions(value: string | Position) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
      return this.positions.pipe(
        map(positions => positions.filter(position => position.name.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.positions;
    }
  }
  displayPositionFn(position?: Position): string | undefined {
    return position ? position.name : undefined;
  }

  private filterCountries(value: string | Country) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
      return this.countries.pipe(
        map(countries => countries.filter(country => country.name.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.countries;
    }
  }
  displayCountryFn(country?: Country): string | undefined {
    return country ? country.name : undefined;
  }

  get thesalary() {
    return this.rForm.get('payGrade');
  }
  get thedepartment() {
    return this.rForm.get('department');
  }
  get theposition() {
    return this.rForm.get('position');
  }
  get thecountry() {
    return this.rForm.get('country');
  }
  //</Dropdown_Stuff>
}

