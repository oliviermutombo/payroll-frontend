import { Component, OnInit, ViewChild, QueryList, ViewChildren, Injector} from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material'; //REMOVE
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from '../../admin/employee/employee';
import { Salary} from '../../admin/salary/salary';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { ApiService } from 'src/app/admin/api.service';
import { Department } from '../../admin/department/department';
import { Position } from '../../admin/position/position';
import { UtilitiesService } from '../../services/utilities.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import * as globals from 'src/app/globals';
import { Country } from '../../admin/countries/country';
import { map, startWith, switchMap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

@Component({
    templateUrl: './personal-details.component.html'
  })

  export class PersonalDetailsComponent implements OnInit {

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
    allEmployees: Observable<Employee[]>;
    filteredEmployees: Observable<Employee[]>;

    employeeTypes: [];
    genders: [];
    titles: [];

    //</Dropdown_Stuff>

    employee = new Employee();

    rForm: FormGroup;
    post: any;
    address1 = '';
    address2 = '';
    postalCode = '';
    country = '';
    phone = 0;
    
    public formErrors = {
        address1: '',
        address2: '',
        postalCode: '',
        country: '',
        cellNumber: '',
        homeNumber: ''
      };

    @ViewChildren(MatAutocompleteTrigger) triggerCollection:  QueryList<MatAutocompleteTrigger>;
    subscription: Subscription;

    constructor(private apiService: ApiService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private location: Location,
              private utilitiesService: UtilitiesService,
              private notification: NotificationService,
              private injector: Injector,
              private formService: FormService) {

        this.rForm = fb.group({
        firstName: [{value: '', disabled: true}],
        middleName: [{value: '', disabled: true}],
        lastName: [{value: '', disabled: true}],
        dob: [{value: '', disabled: true}],
        idNumber: [{value: '', disabled: true}],
        passportNumber: [{value: '', disabled: true}],
        emailAddress: [{value: '', disabled: true}],
        payGrade: [{value: '', disabled: true}],
        basicPay: [{value: '', disabled: true}],
        department: [{value: '', disabled: true}],
        position: [{value: '', disabled: true}],
        taxNumber: [{value: '', disabled: true}],
        hireDate: [{value: '', disabled: true}],
        address1: [null, [Validators.minLength(1), Validators.maxLength(50)]],
        address2: [null, [Validators.minLength(1), Validators.maxLength(50)]],
        postalCode: [null, [Validators.minLength(1), Validators.maxLength(10)]],
        country: [null],
        cellNumber: [null, [Validators.minLength(1), Validators.maxLength(15)]],
        homeNumber: [null, [Validators.minLength(1), Validators.maxLength(15)]],
        bankName: [{value: '', disabled: true}],
        bankAccount: [{value: '', disabled: true}],
        bankBranch: [{value: '', disabled: true}],
        bankSwift: [{value: '', disabled: true}],
        title: [{value: '', disabled: true}],
        gender: [{value: '', disabled: true}],
        active: [{value: '', disabled: true}],
        employeeType: [{value: '', disabled: true}],
        maritalStatus: [{value: '', disabled: true}],
        nationality: [{value: '', disabled: true}],
        hourlyRate: [{value: '', disabled: true}],
        leaveDate: [{value: '', disabled: true}],
        extension: [{value: '', disabled: true}],
        personalEmail: [null, [Validators.email]],
        manager: [{value: '', disabled: true}],
        });

        this.rForm.valueChanges.subscribe((data) => {
        this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
        });
    }
  
    notifier = this.injector.get(NotificationService);

    ngOnInit() {
        //<Dropdown_Stuff>
        this.getCountries();
        this.filteredCountries = this.thecountry.valueChanges
        .pipe(
        startWith(''),
        switchMap(value => this.filterCountries(value))
        );
        this.getEmployeeTypes();
        this.getGenders();
        this.getTitles();
        //</Dropdown_Stuff>

        this.getEmployeeToEdit();
    }
    getEmployeeToEdit(): void {
        this.employeeEdit();
    }

    getEmployee(id): void {//CHECK IF USED+++++++++++++++++++++++++++++++++++++++++++++++++++
        this.apiService.getSelf(globals.EMPLOYEE_ENDPOINT).subscribe(
          (res: Employee) => {
            this.employee = res;
          },
          (err) => {
            this.notifier.showError('Error occurred while retrieving employee details!');
          }
        );
    }

    employeeEdit(){
        this.apiService.getSelf(globals.EMPLOYEE_ENDPOINT).subscribe(
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
            this.notifier.showError('Error occurred while populating employee details!');
          }
        );
    }
    //
    saveDetails(f) {
        let employeeToUpdate = {};

        employeeToUpdate['id'] = this.employee.id;
        employeeToUpdate['personalEmail'] = f.personalEmail;

        let phone = {};
        phone['home'] = f.homeNumber;
        phone['cell'] = f.cellNumber;
        if (!this.utilitiesService.allPropertiesNull(phone)) {
            if (this.employee.phone) phone['id'] = this.employee.phone.id;
            employeeToUpdate['phone'] = phone;
        } else 
            employeeToUpdate['phone'] = null;

        let address = {};
        address['line1'] = f.address1;
        address['line2'] = f.address2;
        address['postalCode'] = f.postalCode;
        address['country'] = (f.country) ? this.utilitiesService.generateQuickIdObject(f.country) : null;//important
        //alert('f.country\n' + f.country + '\naddress\n' + JSON.stringify(address));
        if (!this.utilitiesService.allPropertiesNull(address))
        {
          if ((address['line1']) && (address['country'])) {
            if (this.employee.address) address['id'] = this.employee.address.id;//
            employeeToUpdate['address'] = address;
          } else {
            alert('If the address is supplied, please make sure it is valid or remove it entirely.');//KEEP THIS ALERT - IT IS INTENDED
            return;
          }
        } else {
            employeeToUpdate['address'] = null;//Do not discard but set it to null
        }

        this.apiService.updatePersonalDetails(globals.EMPLOYEE_ENDPOINT, employeeToUpdate)
        .subscribe(
            (res) => {
                this.notifier.showSaved();
            }
        );

    }
    //
    //<Dropdown_Stuff>
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

        this.subscription = this.triggerCollection.toArray()[0].panelClosingActions
        .subscribe(e => {
        if (!e || !e.source) {
            if (!this.utilitiesService.isObject(this.rForm.getRawValue().country))
            this.rForm.controls.country.setValue(null);
        }
        },
        err => this._subscribeToClosingActions(),
        () => this._subscribeToClosingActions());
    }
    
    displaySalaryFn(salary?: Salary): string | undefined {
        return salary ? salary.payGrade + ' (Basic pay: R' + salary.basicPay + ')' : undefined;
    }
    displayDepartmentFn(department?: Department): string | undefined {
        return department ? department.name : undefined;
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
    displayManagerFn(employee?: Employee): string | undefined {
        return employee ? employee.firstName + ' ' + employee.lastName : undefined;
    }
    get thecountry() {
        return this.rForm.get('country');
    }
    //</Dropdown_Stuff>
}