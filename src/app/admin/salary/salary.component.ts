import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

import { Salary } from './salary';
import { ApiService } from 'src/app/admin/api.service';
import { NotificationService } from '../../services/notification.service'; // new
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material'; //pagination
import * as globals from 'src/app/globals';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-root', // WHAT MUST THE SELECTOR BE???
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css'/*,
  '../../../styles/global/libs/css/style.css'*/
]
})
export class SalaryComponent implements OnInit {
  title = 'payroll-system (SALARY)';
  salaries: MatTableDataSource<Salary>;
  displayedColumns: string[] = ['payGrade', 'basicPay', 'manage'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  error = '';
  success = '';

  salary = new Salary('', 0);

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;                     // A property for our submitted form
  payGrade = '';
  basicPay = 0;
  requiredAlert = 'This field is required';

  constructor(private injector: Injector,
    private apiService: ApiService, 
    private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService) {
    this.rForm = fb.group({
        payGrade: [null, Validators.required],
        basicPay: [null, [Validators.required, Validators.pattern('^[0-9]+(?:\.[0-9]+)?$')]]
      });
  }

  notifier = this.injector.get(NotificationService); // new

  ngOnInit() {
    if (this.showList) {
      this.getSalaries();
    }
  }

  showHideList($isChecked): void {
    if ($isChecked) {
      if (!this.salaries) {
        // Above Condition added to make the list available on demand. can't retrieve list if not defined (or it throws an error)
        this.getSalaries();
      }
      this.showList = true;
    } else {
      this.showList = false;
    }
  }

  applyFilter(filterValue: string) {
    this.salaries.filter = filterValue.trim().toLowerCase();

    if (this.salaries.paginator) {
      this.salaries.paginator.firstPage();
    }
  }

  getSalaries(): void {
    this.apiService.getAll(globals.SALARY_ENDPOINT).subscribe(
      (res: Salary[]) => {
        this.salaries = new MatTableDataSource(res);
        this.salaries.paginator = this.paginator;
        this.salaries.sort = this.sort;
      }/*,
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }*/
    );
  }

  getSalary(id): void {
    this.apiService.getById(globals.SALARY_ENDPOINT, id).subscribe(
      (res: Salary) => {
        this.salary = res;
      }/*,
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }*/
    );
  }

  addSalary(f) {
    this.resetErrors();

    let salary = new Salary();//Very important - otherwise, if say a salary profile was active for update. it will use it.
    salary.payGrade = f.payGrade;
    salary.basicPay = f.basicPay;

    this.apiService.save(globals.SALARY_ENDPOINT, salary, (this.salaries) ? this.salaries.data : null)
      .subscribe(
        (res: Salary[]) => {
          // Update the list of salaries
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.salaries.data = res;
          }
          // Inform the user
          this.success = 'Created successfully'; // to be decomissioned
          this.notifier.showSaved();

          // Reset the form
          this.rForm.reset();
        }/*,
        (err) => this.error = err*/
      );
  }

  salaryEdit(id){
    this.apiService.getById(globals.SALARY_ENDPOINT, id).subscribe(
      (res: Salary) => {
        this.salary = res;
        this.rForm.setValue({
          payGrade: this.salary.payGrade,
          basicPay: this.salary.basicPay
        });
      }/*,
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }*/
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updateSalary(f) {
    this.resetErrors();
    this.salary.payGrade = f.payGrade;
    this.salary.basicPay = f.basicPay;
    this.apiService.update(globals.SALARY_ENDPOINT, this.salary, this.salaries.data)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.salaries.data = res;
          }
          this.success = 'Updated successfully'; // to be decomissioned
          // Inform the user
          this.notifier.showSaved();
          this.salary = new Salary(); //reset object after update.
          this.updateMode = false;
          this.rForm.reset();
        }/*,
        (err) => this.error = err*/
      );
  }

  public openConfirmationDialog(id) {
    this.confirmationDialogService.confirm('Please confirm...', 'Are you sure you want to delete?')
    .then((confirmed) => {
      if (confirmed) this.deleteSalary(id);
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  deleteSalary(id) {
    this.resetErrors();
    this.apiService.delete(globals.SALARY_ENDPOINT, id, this.salaries.data)
      .subscribe(
        (res: Salary[]) => {
          if (this.showList) {
            this.salaries.data = res;
          }
          this.success = 'Deleted successfully'; // to be decomissioned
          // Inform the user
          this.notifier.showDeleted();

          this.updateMode = false;
          this.rForm.reset();
        }/*,
        (err) => this.error = err*/
      );
  }

  private resetErrors() { // to be decomissioned
    this.success = '';
    this.error   = '';
  }
}
