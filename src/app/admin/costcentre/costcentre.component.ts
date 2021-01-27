import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Costcentre } from './costcentre';
import { Employee } from '../employee/employee';
import { DataService } from '../data.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { UtilitiesService } from '../../services/utilities.service';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';/////////////////////////////////
import { Subscription } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; //pagination
import { ApiService } from 'src/app/admin/api.service';
import * as globals from 'src/app/globals';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-costcentre',
  templateUrl: './costcentre.component.html',
  styleUrls: ['./costcentre.component.css']
})

export class CostcentreComponent implements OnInit {
  title = 'payroll-system';
  costcentres: MatTableDataSource<Costcentre>;

  costcentre = new Costcentre('', '');
  allEmployees: Observable<Employee[]>;
  filteredEmployees: Observable<Employee[]>;

  displayedColumns: string[] = ['name', 'description', 'owner', 'manageColumn'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  subscription: Subscription;

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;
  name = '';
  description = '';
  owner = '';

  public formErrors = {
    name: '',
    description: '',
    owner: '',
  };

  constructor(private injector: Injector,
              private apiService: ApiService,
              private dataService: DataService,
              private utilitiesService: UtilitiesService,
              private fb: FormBuilder,
              public formService: FormService,
              private confirmationDialogService: ConfirmationDialogService) {
                
    this.rForm = fb.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
      description : [null, [Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
      owner: [null]
    });

    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    this.getEmployees();
    this.filteredEmployees = this.theowner.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterEmployees(value))
    );
    if (this.showList) {
      this.getCostcentres();
    }
  }

  showHideList($isChecked): void {
    if ($isChecked) {
      if (!this.costcentres) {
        // Above Condition added to make the list available on demand. can't retrieve list if not defined (or it throws an error)
        this.getCostcentres();
      }
      this.showList = true;
    } else {
      this.showList = false;
    }
  }

  getEmployees(): void {
    this.allEmployees = this.dataService.getAllEmployees();
  }

  applyFilter(filterValue: string) {
    this.costcentres.filter = filterValue.trim().toLowerCase();

    if (this.costcentres.paginator) {
      this.costcentres.paginator.firstPage();
    }
  }
  
  getCostcentres(): void {
    this.apiService.getAll(globals.COSTCENTRE_ENDPOINT).subscribe(
      (res: Costcentre[]) => {
        this.costcentres = new MatTableDataSource(res);
        this.costcentres.paginator = this.paginator;
        this.costcentres.sort = this.sort;
      }
    );
  }

  getCostcentre(id): void {
    this.apiService.getById(globals.COSTCENTRE_ENDPOINT, id).subscribe(
      (res: Costcentre) => {
        this.costcentre = res;
      }
    );
  }

  addCostcentre(f) {
    let costcentre = new Costcentre();
    costcentre.name = f.name;
    costcentre.description = f.description;
    if (f.owner) { //Only populating relevant fields (which will be used to update view list and save api call cost)
      costcentre.owner = {};
      costcentre.owner.id = f.owner.id;
      costcentre.owner.firstName = f.owner.firstName;
      costcentre.owner.lastName = f.owner.lastName;
    }

    this.apiService.save(globals.COSTCENTRE_ENDPOINT, costcentre, (this.costcentres) ? this.costcentres.data : null)
      .subscribe(
        (res: Costcentre[]) => {
          // Update the list of costcentres
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.costcentres.data = res; // Impelement a list refresh rather
          }
          // Inform the user
          this.notifier.showSaved();

          // Reset the form
          this.rForm.reset();
        }
      );
  }

  costcentreEdit(id) {
    this.apiService.getById(globals.COSTCENTRE_ENDPOINT, id).subscribe(
      (res: Costcentre) => {
        this.costcentre = res;
        this.rForm.setValue({
          name: this.costcentre.name,
          description: this.costcentre.description,
          owner: (this.costcentre.owner != null) ? this.costcentre.owner : null//"this.costcentre.owner",
        });
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updateCostcentre(f) {
    let updatedCostcentre = new Costcentre();
    updatedCostcentre.id = this.costcentre.id;
    updatedCostcentre.name = f.name;
    updatedCostcentre.description = f.description;
    if (f.owner) { //Only populating relevant fields (which will be used to update view list and save api call cost)
      updatedCostcentre.owner = {};
      updatedCostcentre.owner.id = f.owner.id;
      updatedCostcentre.owner.firstName = f.owner.firstName;
      updatedCostcentre.owner.lastName = f.owner.lastName;
    }
    this.apiService.update(globals.COSTCENTRE_ENDPOINT, updatedCostcentre, this.costcentres.data)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.costcentres.data = res;
          }
          this.costcentre = new Costcentre();
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  public openConfirmationDialog(id) {
    this.confirmationDialogService.confirm('Please confirm...', 'Are you sure you want to delete?')
    .then((confirmed) => {
      if (confirmed) this.deleteCostcentre(id);
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  deleteCostcentre(id) {
    this.apiService.delete(globals.COSTCENTRE_ENDPOINT, id, this.costcentres.data)
      .subscribe(
        (res: Costcentre[]) => {
          if (this.showList) {
            this.costcentres.data = res; // Impelement a list refresh rather
          }
          this.notifier.showDeleted();
          this.updateMode = false;
          this.rForm.reset();
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

    this.subscription = this.trigger.panelClosingActions
      .subscribe(e => {
        if (!e || !e.source) {
          console.log(this.trigger)
          console.log(e)
          if (!this.utilitiesService.isObject(this.rForm.getRawValue().owner)) {
            this.rForm.controls.owner.setValue(null);
          }
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  private filterEmployees(value: string | Employee) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName.toLowerCase();
      return this.allEmployees.pipe(
        //map(employees => employees.filter(employee => employee.firstName.toLowerCase().includes(filterValue)))
        map(employees => employees.filter(employee => employee.firstName.toLowerCase().includes(filterValue) || employee.lastName.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.allEmployees;
    }
  }

  get theowner() {
    return this.rForm.get('owner');
  }

  displayFn(employee?: Employee): string | undefined {
    return employee ? employee.firstName + ' ' + employee.lastName : undefined;
  }
}
