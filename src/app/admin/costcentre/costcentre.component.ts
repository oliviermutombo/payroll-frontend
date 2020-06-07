import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Costcentre } from './costcentre';
import { Employee } from '../employee/employee';
import { CostcentreService } from './costcentre.service';
import { DataService } from '../data.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';/////////////////////////////////
import { Subscription } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material'; //pagination
import { ApiService } from 'src/app/admin/api.service';

@Component({
  selector: 'app-costcentre',
  templateUrl: './costcentre.component.html',
  styleUrls: ['./costcentre.component.css']
})

export class CostcentreComponent implements OnInit {
  title = 'payroll-system';
  entityEndpoint = '/costcentres';
  costcentres: MatTableDataSource<Costcentre>;
  error = '';
  success = '';

  costcentre = new Costcentre('', '');
  allEmployees: Observable<Employee[]>;
  filteredEmployees: Observable<Employee[]>;

  displayedColumns: string[] = ['name', 'owner', 'manageColumn'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  subscription: Subscription;

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;
  name = '';
  owner = '';

  public formErrors = {
    name: '',
    owner: '',
  };

  constructor(private injector: Injector,
              private costcentreService: CostcentreService,
              private apiService: ApiService,
              private dataService: DataService,
              private fb: FormBuilder,
              public formService: FormService) {
                
    this.rForm = fb.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
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
  
  getCostcentres(): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.costcentreService.getAllCostcentres().subscribe(
      (res: Costcentre[]) => {
        this.costcentres = new MatTableDataSource(res);
        this.costcentres.paginator = this.paginator;
        this.costcentres.sort = this.sort;
      }
    );
  }

  getCostcentre(id): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.costcentreService.getCostcentre(id).subscribe(
      (res: Costcentre) => {
        this.costcentre = res;
      }
    );
  }

  addCostcentre(f) {
    this.resetErrors();
    let costcentre = new Costcentre();
    costcentre.name = f.name;
    if (f.owner) costcentre.owner = this.dataService.generateQuickIdObject(f.owner.id);

    this.costcentreService.storeCostcentre(costcentre)
      .subscribe(
        (res: Costcentre[]) => {
          // Update the list of costcentres
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.costcentres = new MatTableDataSource(res); // Impelement a list refresh rather
          }
          // Inform the user
          this.success = 'Created successfully';
          this.notifier.showSaved();

          // Reset the form
          this.rForm.reset();
        }
      );
  }

  costcentreEdit(id) {
    this.costcentreService.getCostcentre(id).subscribe(
      (res: Costcentre) => {
        this.costcentre = res;
        this.rForm.setValue({
          name: this.costcentre.name,
          owner: (this.costcentre.owner != null) ? this.costcentre.owner : null//"this.costcentre.owner",
        });
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updateCostcentre(f) {
    this.resetErrors();
    this.costcentre.name = f.name;
    this.costcentre.owner = this.dataService.generateQuickIdObject(f.owner.id);//check behaviour when null
    //this.costcentreService.updateCostcentre(this.costcentre)
    this.apiService.update(this.entityEndpoint, this.costcentre, this.costcentres.data)
      .subscribe(
        (res) => {
          if (this.showList) {
            //alert('res\n' + JSON.stringify(res));
            this.costcentres = new MatTableDataSource(res);
          }
          this.success = 'Updated successfully';
          this.costcentre = new Costcentre();
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  deleteCostcentre(id) {
    this.resetErrors();
    this.costcentreService.deleteCostcentre(id)
      .subscribe(
        (res: Costcentre[]) => {
          if (this.showList) {
            this.costcentres = new MatTableDataSource(res); // Impelement a list refresh rather
          }
          this.success = 'Deleted successfully';
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
          this.rForm.controls.owner.setValue(null);
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

  private resetErrors() {
    this.success = '';
    this.error   = '';
  }
}
