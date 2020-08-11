import { Component, OnInit, ViewChild, QueryList, ViewChildren, Injector} from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; //REMOVE
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
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  //selector: 'app-root', // WHAT MUST THE SELECTOR BE???
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})

export class ManageEmployeeComponent implements OnInit {

  //title = 'payroll-system';
  employees: Employee[];

  //<Dropdown_Stuff>
  salaries: Observable<Salary[]>;
  filteredSalaries: Observable<Salary[]>;
  departments: Observable<Department[]>;
  filteredDepartments: Observable<Department[]>;
  positions: Observable<Position[]>;
  filteredPositions: Observable<Position[]>;
  countries: Observable<Country[]>;
  filteredCountries: Observable<Country[]>;
  filteredNationalities: Observable<Country[]>;
  allEmployees: Observable<Employee[]>;
  filteredEmployees: Observable<Employee[]>;

  employeeTypes: [];
  genders: [];
  titles: [];

  //</Dropdown_Stuff>

  //employee = new Employee('', '', '', '', '', '', '', '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '');
  employee = new Employee();

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
  title = 0;
  gender = 0;
  active = 0;
  employeeType = 0;
  maritalStatus = 0;
  nationality = 0;
  hourlyRate = 0;
  leaveDate = 0;
  phone = 0;
  extension = '';
  personalEmail = '';
  manager = 0;
  bankingDetails = 0;



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
    title: '',
    gender: '',
    active: '',
    employeeType: '',
    maritalStatus: '',
    nationality: '',
    hourlyRate: '',
    leaveDate: '',
    cellNumber: '',
    homeNumber: '',
    extension: '',
    personalEmail: '',
    manager: '',
    bankName: '',
    bankAccount: '',
    bankBranch: '',
    bankSwift: '',
  };
  
  @ViewChildren(MatAutocompleteTrigger) triggerCollection:  QueryList<MatAutocompleteTrigger>;
  subscription: Subscription;

  constructor(private injector: Injector,
              private apiService: ApiService,
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
      department: [null, [Validators.required]],
      position: [null, [Validators.required]],
      taxNumber: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      hireDate: [null, [Validators.required]],
      address1: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      address2: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      postalCode: [null, [Validators.minLength(1), Validators.maxLength(10)]],
      country: [null],
      cellNumber: [null, [Validators.minLength(1), Validators.maxLength(15)]],
      homeNumber: [null, [Validators.minLength(1), Validators.maxLength(15)]],
      bankName: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankAccount: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankBranch: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      bankSwift: [null, [Validators.minLength(1), Validators.maxLength(20)]],
      title: [null],
      gender: [null],
      active: [null],
      employeeType: [null],
      maritalStatus: [null],
      nationality: [null],
      hourlyRate: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      leaveDate: [null],
      extension: [null, [Validators.minLength(1), Validators.maxLength(15)]],
      personalEmail: [null, [Validators.email]],
      manager: [null],
    });

    // on each value change we call the validateForm function
    // We only validate form controls that are dirty, meaning they are touched
    // the result is passed to the formErrors object
    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  notifier = this.injector.get(NotificationService);

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
    this.filteredNationalities = this.thenationality.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterCountries(value))
    );
    this.getEmployees();
    this.filteredEmployees = this.theManager.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterEmployees(value))
    );

    this.getEmployeeTypes();
    this.getGenders();
    this.getTitles();
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

  /*FIND WHERE THIS IMPLEMENTATION IS USED! IF NOWHERE, REMOVE
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
  }*/

  goBack(): void {
    this.location.back();
  }

  getEmployee(id): void {
    this.apiService.getById(globals.EMPLOYEE_ENDPOINT, id).subscribe(
      (res: Employee) => {
        this.employee = res;
      },
      (err) => {
        this.notifier.showError("Could not retrieve employee!");
      }
    );
  }

  addEmployee(f) {

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

    this.employee.active = true;
    this.employee.title = (f.title) ? this.utilitiesService.generateQuickIdObject(f.title) : null;//id?
    this.employee.gender = (f.gender) ? this.utilitiesService.generateQuickIdObject(f.gender) : null;//.id?
    this.employee.employeeType = (f.employeeType) ? this.utilitiesService.generateQuickIdObject(f.employeeType) : null;//.id?
    this.employee.maritalStatus = (f.maritalStatus) ? f.maritalStatus : null;//.id?
    this.employee.nationality = (f.nationality) ? this.utilitiesService.generateQuickIdObject(f.nationality) : null;
    this.employee.hourlyRate = f.hourlyRate;
    this.employee.leaveDate = f.leaveDate;
    this.employee.extension = f.extension;
    this.employee.personalEmail = f.personalEmail;
    this.employee.manager = (f.manager) ? this.utilitiesService.generateQuickIdObject(f.manager) : null;////////////

    let phone = {};
        phone['home'] = f.homeNumber;
        phone['cell'] = f.cellNumber;
    if (!this.utilitiesService.allPropertiesNull(phone)) {
      this.employee.phone = phone;
    }

    let bankingDetails = {};
        bankingDetails['bank_name'] = f.bankName;
        bankingDetails['bank_account'] = f.bankAccount;
        bankingDetails['branch_code'] = f.bankBranch;
        bankingDetails['swift_code'] = f.bankSwift;
    if (!this.utilitiesService.allPropertiesNull(bankingDetails)) {
      if ((bankingDetails['bank_name']) && (bankingDetails['bank_name']))
        this.employee.bankingDetails = bankingDetails;
      else {
        alert('If banking details are supplied, please make sure to include bank name and account number or remove it entirely.');//KEEP THIS ALERT - IT IS INTENDED
        return;
      }
    }
        
    let address = {};
        address['line1'] = f.address1;
        address['line2'] = f.address2;
        address['postalCode'] = f.postalCode;
        address['country'] = this.utilitiesService.generateQuickIdObject(f.country);
    if (!this.utilitiesService.allPropertiesNull(address))
    {
      if ((address['line1']) && (address['country']))
        this.employee.address = address;
      else {
        alert('If the address is supplied, please make sure it is valid or remove it entirely.');//KEEP THIS ALERT - IT IS INTENDED
        return;
      }
    } // else address is null, it will be discarded.
    
    //alert('Adding\n' + JSON.stringify(this.employee));
    console.log(this.employee);
    this.apiService.saveOnly(globals.EMPLOYEE_ENDPOINT, this.employee)
      .subscribe(
        (res: boolean) => {
          if (res) {
            this.notifier.showSaved();
          } else {
            this.notifier.showGenericError();
          }
          this.rForm.reset();
        },
        (err) => this.notifier.showGenericError()
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
          address1: (this.employee.address != null) ? this.employee.address.line1 : null,
          address2: (this.employee.address != null) ? this.employee.address.line2 : null,
          postalCode: (this.employee.address != null) ? this.employee.address.postalCode : null,
          country: (this.employee.address != null) ? this.employee.address.country : null,

          active: this.employee.active,
          title: (this.employee.title != null) ? this.employee.title.id : null,
          gender: (this.employee.gender != null) ? this.employee.gender.id : null,
          employeeType: (this.employee.employeeType != null) ? this.employee.employeeType.id : null,
          maritalStatus: this.employee.maritalStatus,
          nationality: this.employee.nationality,
          hourlyRate: this.employee.hourlyRate,
          leaveDate: this.employee.leaveDate,
          extension: this.employee.extension,
          personalEmail: this.employee.personalEmail,
          manager: this.employee.manager,
          homeNumber: (this.employee.phone != null) ? this.employee.phone.home : null,
          cellNumber: (this.employee.phone != null) ? this.employee.phone.cell : null,
          bankName: (this.employee.bankingDetails != null) ? this.employee.bankingDetails.bank_name : null,
          bankAccount: (this.employee.bankingDetails != null) ? this.employee.bankingDetails.bank_account : null,
          bankBranch: (this.employee.bankingDetails != null) ? this.employee.bankingDetails.branch_code : null,
          bankSwift: (this.employee.bankingDetails != null) ? this.employee.bankingDetails.swift_code : null,
        });
      },
      (err) => {
        this.notifier.showGenericError();
      }
    );
  }

  updateEmployee(f) {
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

    this.employee.active = f.active;
    this.employee.title = (f.title) ? this.utilitiesService.generateQuickIdObject(f.title) : null;
    this.employee.gender = (f.gender) ? this.utilitiesService.generateQuickIdObject(f.gender) : null;
    this.employee.employeeType = (f.employeeType) ? this.utilitiesService.generateQuickIdObject(f.employeeType) : null;
    this.employee.maritalStatus = (f.maritalStatus) ? f.maritalStatus : null;
    this.employee.nationality = (f.nationality) ? this.utilitiesService.generateQuickIdObject(f.nationality) : null;
    this.employee.hourlyRate = f.hourlyRate;
    this.employee.leaveDate = f.leaveDate;
    this.employee.extension = f.extension;
    this.employee.personalEmail = f.personalEmail;
    this.employee.manager = (f.manager) ? this.utilitiesService.generateQuickIdObject(f.manager) : null;

    let phone = {};
        phone['home'] = f.homeNumber;
        phone['cell'] = f.cellNumber;
    if (!this.utilitiesService.allPropertiesNull(phone)) {
      if (this.employee.phone) phone['id'] = this.employee.phone.id;//
      this.employee.phone = phone;
    } else 
    this.employee.phone = null;

    let bankingDetails = {};
        bankingDetails['bank_name'] = f.bankName;
        bankingDetails['bank_account'] = f.bankAccount;
        bankingDetails['branch_code'] = f.bankBranch;
        bankingDetails['swift_code'] = f.bankSwift;
    if (!this.utilitiesService.allPropertiesNull(bankingDetails)) {
      if ((bankingDetails['bank_name']) && (bankingDetails['bank_name'])) {
        if (this.employee.bankingDetails) bankingDetails['id'] = this.employee.bankingDetails.id;//
        this.employee.bankingDetails = bankingDetails;
      } else {
        alert('If banking details are supplied, please make sure to include bank name and account number or remove it entirely.');//KEEP THIS ALERT - IT IS INTENDED
        return;
      }
    } else {
      this.employee.bankingDetails = null;
    }

    let address = {};
        address['line1'] = f.address1;
        address['line2'] = f.address2;
        address['postalCode'] = f.postalCode;
        address['country'] = this.utilitiesService.generateQuickIdObject(f.country);
    //alert('f.country\n' + f.country + '\naddress\n' + JSON.stringify(address));
    if (!this.utilitiesService.allPropertiesNull(address))
    {
      if ((address['line1']) && (address['country'])) {
        if (this.employee.address) address['id'] = this.employee.address.id;
        this.employee.address = address;
      } else {
        alert('If the address is supplied, please make sure it is valid or remove it entirely.');//KEEP THIS ALERT - IT IS INTENDED
        return;
      }
    } else {
      this.employee.address = null;//Do not discard but set it to null
    }

    this.apiService.updateOnly(globals.EMPLOYEE_ENDPOINT, this.employee)
      .subscribe(
        (res) => {
          this.notifier.showSaved();
        },
        (err) => this.notifier.showGenericError()
      );
    window.scroll(0, 0);
  }

  deleteEmployee(id) {
    this.apiService.deleteOnly(globals.EMPLOYEE_ENDPOINT, id)
      .subscribe(
        (res: boolean) => {
          this.notifier.showDeleted();
        },
        (err) => this.notifier.showGenericError()
      );
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
  getEmployees(): void {
    this.allEmployees = this.apiService.getAll(globals.EMPLOYEE_ENDPOINT);
  }
  /*getEmployees(): void {
    this.allEmployees = Observable.of(_);
    this.apiService.getAll(globals.EMPLOYEE_ENDPOINT).subscribe(_ => {
    this.allEmployees = Observable.of(_);
    })
  }*/
  getEmployeeTypes(): void {
    this.apiService.getAll(globals.EMPLOYEE_TYPE_ENDPOINT).subscribe(
      (res: []) => {
        this.employeeTypes = res;
      }
    );
  }
  getGenders(): void {
    this.apiService.getAll(globals.GENDER_ENDPOINT).subscribe(
      (res: []) => {
        this.genders = res;
      }
    );
  }
  getTitles(): void {
    this.apiService.getAll(globals.TITLES_ENDPOINT).subscribe(
      (res: []) => {
        this.titles = res;
      }
    );
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
          if (!this.utilitiesService.isObject(this.rForm.getRawValue().nationality))
          this.rForm.controls.nationality.setValue(null);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());

    this.subscription = this.triggerCollection.toArray()[1].panelClosingActions
    .subscribe(e => {
      if (!e || !e.source) {
        if (!this.utilitiesService.isObject(this.rForm.getRawValue().country))
        this.rForm.controls.country.setValue(null);
      }
    },
    err => this._subscribeToClosingActions(),
    () => this._subscribeToClosingActions());

    this.subscription = this.triggerCollection.toArray()[2].panelClosingActions
    .subscribe(e => {
      if (!e || !e.source) {
        if (!this.utilitiesService.isObject(this.rForm.getRawValue().department))
        this.rForm.controls.department.setValue(null);
      }
    },
    err => this._subscribeToClosingActions(),
    () => this._subscribeToClosingActions());

    this.subscription = this.triggerCollection.toArray()[3].panelClosingActions
    .subscribe(e => {
      if (!e || !e.source) {
        if (!this.utilitiesService.isObject(this.rForm.getRawValue().position))
        this.rForm.controls.position.setValue(null);
      }
    },
    err => this._subscribeToClosingActions(),
    () => this._subscribeToClosingActions());
    
    this.subscription = this.triggerCollection.toArray()[4].panelClosingActions
    .subscribe(e => {
      if (!e || !e.source) {
        if (!this.utilitiesService.isObject(this.rForm.getRawValue().manager))
        this.rForm.controls.manager.setValue(null);
      }
    },
    err => this._subscribeToClosingActions(),
    () => this._subscribeToClosingActions());

    this.subscription = this.triggerCollection.toArray()[5].panelClosingActions
    .subscribe(e => {
      if (!e || !e.source) {
        if (!this.utilitiesService.isObject(this.rForm.getRawValue().payGrade))
        this.rForm.controls.payGrade.setValue(null);
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
  /*private filterNationalities(value: string | Country) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
      return this.countries.pipe(
        map(countries => countries.filter(country => country.name.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.countries;
    }
  }*/
  displayCountryFn(country?: Country): string | undefined {
    return country ? country.name : undefined;
  }

  private filterEmployees(value: string | Employee) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName.toLowerCase();
      return this.allEmployees.pipe(
        map(employees => employees.filter(employee => employee.firstName.toLowerCase().includes(filterValue) || employee.lastName.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.allEmployees;
    }
  }
  displayManagerFn(employee?: Employee): string | undefined {
    return employee ? employee.firstName + ' ' + employee.lastName : undefined;
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
  get thenationality() {
    return this.rForm.get('nationality');
  }
  get theManager() {
    return this.rForm.get('manager');
  }
  //</Dropdown_Stuff>
}

