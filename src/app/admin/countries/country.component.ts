import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Country } from './country';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../services/custom_validators';
import { ApiService } from 'src/app/admin/api.service';
import { DataService } from '../data.service';
import { FormService } from '../../services/form';
import { NotificationService } from 'src/app/services/notification.service';
import * as globals from 'src/app/globals';


@Component({
    selector: '', // WHAT MUST THE SELECTOR BE???
    templateUrl: './country.component.html'
  })

  export class CountryComponent implements OnInit {

    countries: MatTableDataSource<Country>;

    displayedColumns: string[] = ['name', 'code', 'zip', 'currency', 'symbol', 'manage'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    country = new Country('','','');

    rForm: FormGroup;
    updateMode = false;
    name = '';
    code = '';
    zip = '';
    currency = '';
    symbol = '';

    public formErrors = {
        name: '',
        code: '',
        zip: '',
        currency: '',
        symbol: ''
      };

    constructor(private injector: Injector,
        private apiService: ApiService,
        private dataService: DataService,
        private fb: FormBuilder,
        public formService: FormService) {

        this.rForm = fb.group({
            name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
            code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(3), CustomValidators.validateCharacters]],
            zip: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5), CustomValidators.validateCharacters]],
            currency: [null, [Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
            symbol: [null]
        });

        this.rForm.valueChanges.subscribe((data) => {
        this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
        });
    }

    notifier = this.injector.get(NotificationService);

    ngOnInit() {
        this.getCountries();
    }

    applyFilter(filterValue: string) {
        this.countries.filter = filterValue.trim().toLowerCase();
    
        if (this.countries.paginator) {
          this.countries.paginator.firstPage();
        }
      }

    getCountries(): void {
      this.apiService.getAll(globals.COUNTRY_ENDPOINT).subscribe(
          (res: Country[]) => {
            this.countries = new MatTableDataSource(res);
            this.countries.paginator = this.paginator;
            this.countries.sort = this.sort;
          }
        );
      }
    
      getCountry(id): void {
        this.apiService.getById(globals.COUNTRY_ENDPOINT, id).subscribe(
          (res: Country) => {
            this.country = res;
          }
        );
      }
    
      addCountry(f) {
        let country = new Country();
        country.name = f.name;
        country.code = f.code;
        country.zip = f.zip;
        country.currency = f.currency;
        country.symbol = f.symbol;
        this.apiService.save(globals.COUNTRY_ENDPOINT, country, (this.countries) ? this.countries.data : null)
          .subscribe(
            (res: Country[]) => {
              // Update the list of countries
              this.countries.data = res;
              // Inform the user
              this.notifier.showSaved();
    
              // Reset the form
              this.rForm.reset();
            }
          );
      }
    
      countryEdit(id) {
        this.apiService.getById(globals.COUNTRY_ENDPOINT, id).subscribe(
          (res: Country) => {
            this.country = res;
            this.rForm.setValue({
              name: this.country.name,
              code: this.country.code,
              zip: this.country.zip,
              currency: (this.country.currency != null) ? this.country.currency : null,
              symbol: (this.country.symbol != null) ? this.country.symbol : null
            });
          }
        );
        this.updateMode = true;
        window.scroll(0, 0);
      }
    
      updateCountry(f) {
        this.country.name = f.name;
        this.country.code = f.code;
        this.country.zip = f.zip;
        this.country.currency = f.currency;
        this.country.symbol = f.symbol;
        this.apiService.update(globals.COUNTRY_ENDPOINT, this.country, this.countries.data)
          .subscribe(
            (res) => {
                this.countries.data = res;
                this.notifier.showSaved();
                this.updateMode = false;
                this.rForm.reset();
            }
          );
      }
    
      deleteCountry(id) {
        this.apiService.delete(globals.COUNTRY_ENDPOINT, id, this.countries.data)
          .subscribe(
            (res: Country[]) => {
              this.countries.data = res;
              this.notifier.showDeleted();
              this.updateMode = false;
              this.rForm.reset();
            }
          );
      }
  }