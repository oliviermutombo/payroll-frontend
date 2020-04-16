import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Department } from './department';
import { DepartmentService } from './department.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { DataService } from '../data.service';
import { NotificationService } from '../../services/notification.service';
import { Costcentre } from '../costcentre/costcentre'; // For dropdown

@Component({
  selector: 'app-department', // WHAT MUST THE SELECTOR BE???
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent implements OnInit {
  title = 'payroll-system';
  departments: Department[];
  error = '';
  success = '';
  costcentres: Costcentre[]; // For dropdown

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

  constructor(private injector: Injector,
              private departmentService: DepartmentService,
              private dataService: DataService,
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
    if (this.showList) {
      this.getDepartments();
    }
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

  // for dropdown
  getCostcentres(): void {
    this.dataService.getAllCostcentres().subscribe(
      (res: Costcentre[]) => {
        this.costcentres = res;
      }
    );
  }

  getDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      (res: Department[]) => {
        this.departments = res;
      }
    );
  }

  getDepartment(id): void {
    this.departmentService.getDepartment(id).subscribe(
      (res: Department) => {
        this.department = res;
      }
    );
  }

  addDepartment(f) {
    this.resetErrors();

    this.department.name = f.name;
    this.department.costcentre = f.costcentre;
    this.department.hod = f.hod;

    this.departmentService.storeDepartment(this.department)
      .subscribe(
        (res: Department[]) => {
          // Update the list of departments
          // Above Condition added to make the list available on demand. service will only populate list if requested.
          if (this.showList) {
            // Refresh the entire list because the update only returns the ID of the FK and not the entire FK object
            // for that reason we cannot replace the changed object with the FK object since we only have a reference ID.
            this.getDepartments();
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
    this.departmentService.getDepartment(id).subscribe(
      (res: Department) => {
        this.department = res;
        this.rForm.setValue({
          name: this.department.name,
          costcentre: this.department.costcentre.id,
          hod: this.department.hod
        });
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updateDepartment(f) {
    this.resetErrors();
    this.department.name = f.name;
    this.department.costcentre = f.costcentre;
    this.department.hod = f.hod;
    this.departmentService.updateDepartment(this.department)
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
  }

  deleteDepartment(id) {
    this.resetErrors();
    this.departmentService.deleteDepartment(id)
      .subscribe(
        (res: Department[]) => {
          if (this.showList) {
            this.departments = res;
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
}
