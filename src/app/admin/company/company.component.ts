//FINISH CLASS: GLOBAL VAR FOR COUNTRY ENDPOINT
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { UtilitiesService } from '../../services/utilities.service';
import { NotificationService } from '../../services/notification.service';
import { Costcentre } from '../costcentre/costcentre'; // For dropdown
import { Observable } from 'rxjs';//////////////////////////////////////////////////
import { filter, startWith, map, switchMap } from 'rxjs/operators';/////////////////////////////////
import { Subscription } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material';//.................................
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material'; //pagination
import { Employee } from '../employee/employee';
import { Company } from './company';
import { Country } from '../countries/country';
import { ApiService } from 'src/app/admin/api.service';
import * as globals from 'src/app/globals';


@Component({
    selector: '',
    templateUrl: './company.component.html'
})
  
export class CompanyComponent implements OnInit {
    title = 'payroll-system - Company details';

    company = new Company('','',{});

    rForm: FormGroup;
    updateMode = false;
    name = '';
    registrationNumber='';
    line1='';
    line2='';
    postalCode='';
    country=0;

    countries: Observable<Country[]>;
    filteredCountries: Observable<Country[]>;

    public formErrors = {
        name: '',
        registrationNumber: '',
        line1: '',
        line2: '',
        postalCode: '',
        country: ''
      };

    @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
    subscription: Subscription;

    constructor(private injector: Injector,
        private utilitiesService: UtilitiesService,
        private fb: FormBuilder,
        public formService: FormService,
        public apiService: ApiService) {

        this.rForm = fb.group({
            name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
            registrationNumber: [null, [Validators.required]],
            line1: [null, [Validators.required]],
            line2: [null],
            postalCode: [null],
            country: [null, [Validators.required]]
        });

        this.rForm.valueChanges.subscribe((data) => {
            this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
        });
    }

    notifier = this.injector.get(NotificationService);

    ngOnInit() {        
        this.getCompany();
        
        this.getCountries();
        this.filteredCountries = this.theCountry.valueChanges
            .pipe(
            startWith(''),
            switchMap(value => this.filterCountries(value))
        );
    }

    get theCountry() {
        return this.rForm.get('country');
    }

    getCountries(): void {
        this.countries = this.apiService.getAll(globals.COUNTRY_ENDPOINT);
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

    getCompany(): void {
        //this.companyService.getAllCompanies().subscribe(
        this.apiService.getAll(globals.COMPANY_ENDPOINT).subscribe(
            (res: Company[]) => {//Does this have to be an array?
                if (res.length > 0) {
                    this.company = res[0];
                    this.updateMode = true;
                    this.companyEdit(this.company.id);
                } else {
                    this.updateMode = false;
                }
            }
        );
    }

    save(f) {
        if (this.updateMode) {
            this.updateCompany(f);
        } else {
            this.addCompany(f);
        }
        this.utilitiesService.setCurrencySymbol(true);
    }

    addCompany(f) {
        this.company.name = f.name;
        this.company.registrationNumber = f.registrationNumber;
        let address = {};
        address['line1'] = f.line1;
        address['line2'] = f.line2;
        address['postalCode'] = f.postalCode;
        address['country'] = this.utilitiesService.generateQuickIdObject(f.country);
        this.company.address = address;

        this.apiService.saveOnly(globals.COMPANY_ENDPOINT,this.company)
          .subscribe(
                (res: boolean) => {
                    if (res) {
                        this.notifier.showSaved(); 
                    } else {
                        this.notifier.showGenericError();
                    }
                }
            );
        
        /*this.companyService.storeCompany(this.company)
          .subscribe(
            (res: Company) => {
              this.notifier.showSaved(); 
              this.company = res;
              // no need to reset form
              //this.rForm.reset();
            }
        );*/
    }

    updateCompany(f) {
        this.company.name = f.name;
        this.company.registrationNumber = f.registrationNumber;
        this.company.address['line1'] = f.line1;
        this.company.address['line2'] = f.line2;
        this.company.address['postalCode'] = f.postalCode;
        this.company.address['country'] = this.utilitiesService.generateQuickIdObject(f.country); //.id???
        
        this.apiService.updateOnly(globals.COMPANY_ENDPOINT,this.company)
          .subscribe(
            (res: boolean) => {
                if (res) {
                    this.notifier.showSaved(); 
                } else {
                    this.notifier.showGenericError();
                }
            }
        );
        
        /*this.companyService.updateCompany(this.company)
          .subscribe(
            (res) => {
              this.notifier.showSaved();
              this.company = res;
              //this.rForm.reset();
            }
        );*/
    }

    companyEdit(id) {
        //this.companyService.getCompany(id).subscribe(
        this.apiService.getById(globals.COMPANY_ENDPOINT, id).subscribe(
          (res: Company) => {
            this.company = res;
            this.rForm.setValue({
              name: this.company.name,
              registrationNumber: this.company.registrationNumber,
              line1: (this.company.address != null) ? this.company.address.line1 : null,
              line2: (this.company.address != null) ? this.company.address.line2 : null,
              postalCode: (this.company.address != null) ? this.company.address.postalCode : null,
              country: (this.company.address != null) ? this.company.address.country : null, //country.id?
            });
          }
        );
        //this.updateMode = true;
    }
}