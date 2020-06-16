import { Component, OnInit, Injector, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Department } from './department';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { DataService } from '../data.service';
import { ApiService } from 'src/app/admin/api.service';
import { NotificationService } from '../../services/notification.service';
import { Costcentre } from '../costcentre/costcentre'; // For dropdown
import { Observable } from 'rxjs';//////////////////////////////////////////////////
import { filter, startWith, map, switchMap } from 'rxjs/operators';/////////////////////////////////
import { Subscription } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material';//.................................
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material'; //pagination
import { Employee } from '../employee/employee';
import * as globals from 'src/app/globals';

@Component({
  selector: 'app-department', // WHAT MUST THE SELECTOR BE???
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent implements OnInit {
  title = 'payroll-system';
  departments: MatTableDataSource<Department>;
  error = '';
  success = '';
  //costcentres: Costcentre[]; // For dropdown
  allCostcentres: Observable<Costcentre[]>;
  filteredCostcentres: Observable<Costcentre[]>;

  //hod
  allEmployees: Observable<Employee[]>;
  filteredEmployees: Observable<Employee[]>;

  displayedColumns: string[] = ['name', 'hod', 'costcentre', 'manageColumn'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  department = new Department('', 0, '');

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;
  name = '';
  costcentre = 0;
  hod = 0;

  public formErrors = {
    name: '',
    costcentre: '',
    hod: ''
  };

  @ViewChildren(MatAutocompleteTrigger) triggerCollection: QueryList<MatAutocompleteTrigger>;

  subscription: Subscription;

  constructor(private injector: Injector,
              private dataService: DataService,
              private apiService: ApiService,
              private fb: FormBuilder,
              public formService: FormService) {

    this.rForm = fb.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
      costcentre: [null, [Validators.required]],
      hod: [null]
    });

    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    this.getCostcentres();
    this.filteredCostcentres = this.thecostcentre.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterCostcentres(value))
    );
    if (this.showList) {
      this.getDepartments();
    }
    //hod
    this.getEmployees();
    this.filteredEmployees = this.theHod.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.filterEmployees(value))
    );
    if (this.showList) {
      this.getCostcentres();
    }
  }
  getEmployees(): void {
    //this.allEmployees = this.dataService.getAllEmployees();
    this.allEmployees = this.apiService.getAll(globals.EMPLOYEE_ENDPOINT);
  }

  showHideList($isChecked): void {
    if ($isChecked) {
      if (!this.departments) {
        // Above Condition added to make the list available on demand. can't retrieve list if not defined (or it throws an error)
        this.getDepartments();
      }
      this.showList = true;
    } else {
      this.showList = false;
    }
  }

  applyFilter(filterValue: string) {
    this.departments.filter = filterValue.trim().toLowerCase();

    if (this.departments.paginator) {
      this.departments.paginator.firstPage();
    }
  }
  
  getCostcentres(): void {
    //this.allCostcentres = this.dataService.getAllCostcentres();
    this.allCostcentres = this.apiService.getAll(globals.COSTCENTRE_ENDPOINT);
  }

  getDepartments(): void {
    this.apiService.getAll(globals.DEPARTMENT_ENDPOINT).subscribe(
      (res: Department[]) => {
        this.departments = new MatTableDataSource(res);
        this.departments.paginator = this.paginator;
        this.departments.sort = this.sort;
      }
    );
  }

  getDepartment(id): void {
    this.apiService.getById(globals.DEPARTMENT_ENDPOINT, id).subscribe(
      (res: Department) => {
        this.department = res;
      }
    );
  }

  addDepartment(f) {
    this.resetErrors();
    let department = new Department();
    department.name = f.name;
    if (f.costcentre) {
      department.costcentre = {}
      department.costcentre.id = f.costcentre.id;
      department.costcentre.name = f.costcentre.name;
    }
    if (f.hod) {
      department.hod = {};
      department.hod.id = f.hod.id;
      department.hod.firstName = f.hod.firstName;
      department.hod.lastName = f.hod.lastName;
    }
    this.apiService.save(globals.DEPARTMENT_ENDPOINT, department, (this.departments) ? this.departments.data : null)
      .subscribe(
        (res: Department[]) => {
          // Update the list of departments
          // Above Condition added to make the list available on demand. service will only populate list if requested.
          if (this.showList) {
            // Refresh the entire list because the update only returns the ID of the FK and not the entire FK object
            // for that reason we cannot replace the changed object with the FK object since we only have a reference ID.
            this.departments.data = res;
          }
          // Inform the user
          this.success = 'Created successfully';
          this.notifier.showSaved();

          // Reset the form
          this.rForm.reset();
        }
      );
  }

  departmentEdit(id) {
    this.apiService.getById(globals.DEPARTMENT_ENDPOINT, id).subscribe(
      (res: Department) => {
        this.department = res;
        this.rForm.setValue({
          name: this.department.name,
          costcentre: this.department.costcentre,
          hod: (this.department.hod != null) ? this.department.hod : null//this.department.hod
        });
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  /*This could have worked fine to update only changed fields but backend JPA does not allow it by default.
  updateDepartment(f) {
    this.resetErrors();
    
    f.costcentre = this.dataService.generateQuickIdObject(f.costcentre);
    var changesObj = this.dataService.getUpdateObject(this.department, f);
    changesObj['id'] = this.department.id;
    //changesObj['name'] = (changesObj['name']==f.name ? changesObj['name']:f.name);//Doing this because name is not nullable in the backend. but backend logic must be changed to allow update as long as id is provided.

    this.departmentService.updateDepartment(changesObj)
      .subscribe(
        (res) => {
          if (this.showList) {
            // Refresh the entire list because the update only returns the ID of the FK and not the entire FK object
            // for that reason we cannot replace the changed object with the FK object since we only have a reference ID.
            this.getDepartments();
          }
          this.success = 'Updated successfully';
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }*/

  updateDepartment(f) {
    this.resetErrors();
    this.department.name = f.name;
   if (f.costcentre) {
      this.department.costcentre = {}
      this.department.costcentre.id = f.costcentre.id;
      this.department.costcentre.name = f.costcentre.name;
    }
    if (f.hod) {
      this.department.hod = {};
      this.department.hod.id = f.hod.id;
      this.department.hod.firstName = f.hod.firstName;
      this.department.hod.lastName = f.hod.lastName;
    }
    this.apiService.update(globals.DEPARTMENT_ENDPOINT, this.department, this.departments.data)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.departments.data = res;
          }
          this.success = 'Updated successfully';
          this.department = new Department();
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  deleteDepartment(id) {
    this.resetErrors();
    this.apiService.delete(globals.DEPARTMENT_ENDPOINT, id, this.departments.data)
      .subscribe(
        (res: Department[]) => {
          if (this.showList) {
            this.departments.data = res;
          }
          this.success = 'Deleted successfully';
          this.notifier.showDeleted();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  private resetErrors() {
    this.success = '';
    this.error   = '';
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
          //console.log(this.triggerCollection.toArray()[0])
          //console.log(e)
          this.rForm.controls.costcentre.setValue(null);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());

      this.subscription = this.triggerCollection.toArray()[1].panelClosingActions
      .subscribe(e => {
        if (!e || !e.source) {
          //console.log(this.triggerCollection.toArray()[1])
          //console.log(e)
          this.rForm.controls.hod.setValue(null);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }
    
  private filterCostcentres(value: string | Costcentre) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
      return this.allCostcentres.pipe(
        map(costcentres => costcentres.filter(costcentre => costcentre.name.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.allCostcentres;
    }
  }
  displayFn(costcentre?: Costcentre): string | undefined {
    return costcentre ? costcentre.name : undefined;
  }
  
  get thecostcentre() {
    return this.rForm.get('costcentre');
  }

  //hod
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
  displayHodFn(employee?: Employee): string | undefined {
    return employee ? employee.firstName + ' ' + employee.lastName : undefined;
  }

  get theHod() {
    return this.rForm.get('hod');
  }
  /*resetForm() {
    this.rForm.reset();
  }*/
}
