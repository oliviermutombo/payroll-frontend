import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Country } from './country';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../services/custom_validators';
import { CountryService } from './country.service';
import { DataService } from '../data.service';
import { FormService } from '../../services/form';
import { NotificationService } from 'src/app/services/notification.service';


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
        private countryService: CountryService,
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
        this.countryService.getAllCountries().subscribe(
          (res: Country[]) => {
            this.countries = new MatTableDataSource(res);
            this.countries.paginator = this.paginator;
            this.countries.sort = this.sort;
          }
        );
      }
    
      getCountry(id): void {
        this.countryService.getCountry(id).subscribe(
          (res: Country) => {
            this.country = res;
          }
        );
      }
    
      addCountry(f) {
        this.country.name = f.name;
        this.country.code = f.code;
        this.country.zip = f.zip;
        this.country.currency = f.currency;
        this.country.symbol = f.symbol;
        this.countryService.storeCountry(this.country)
          .subscribe(
            (res: Country[]) => {
              // Update the list of countries
              this.getCountries();
              // Inform the user
              this.notifier.showSaved();
    
              // Reset the form
              this.rForm.reset();
            }
          );
      }
    
      countryEdit(id) {
        this.countryService.getCountry(id).subscribe(
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
        this.countryService.updateCountry(this.country)
          .subscribe(
            (res) => {
                this.getCountries();
                this.notifier.showSaved();
                this.updateMode = false;
                this.rForm.reset();
            }
          );
      }
    
      deleteCountry(id) {
        this.countryService.deleteCountry(id)
          .subscribe(
            (res: Country[]) => {
              this.countries = new MatTableDataSource(res);
              this.notifier.showDeleted();
              this.updateMode = false;
              this.rForm.reset();
            }
          );
      }
  }