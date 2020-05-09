import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

import { Salary } from './salary';
import { EmployeeService } from '../employee.service';
import { NotificationService } from '../../services/notification.service'; // new

@Component({
  selector: 'app-root', // WHAT MUST THE SELECTOR BE???
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css'/*,
  '../../../styles/global/libs/css/style.css'*/
]
})
export class SalaryComponent implements OnInit {
  title = 'payroll-system (SALARY)';
  salaries: Salary[];
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

  constructor(private injector: Injector, private employeeService: EmployeeService, private fb: FormBuilder) {
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
  getSalaries(): void {
    this.employeeService.getAllSalaries().subscribe(
      (res: Salary[]) => {
        this.salaries = res;
      }/*,
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }*/
    );
  }

  getSalary(id): void {
    this.employeeService.getSalary(id).subscribe(
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

    this.salary.payGrade = f.payGrade;
    this.salary.basicPay = f.basicPay;

    this.employeeService.storeSalary(this.salary)
      .subscribe(
        (res: Salary[]) => {
          // Update the list of salaries
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.salaries = res;
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
    this.employeeService.getSalary(id).subscribe(
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
    this.employeeService.updateSalary(this.salary)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.salaries = res;
          }
          this.success = 'Updated successfully'; // to be decomissioned
          // Inform the user
          this.notifier.showSaved();

          this.updateMode = false;
          this.rForm.reset();
        }/*,
        (err) => this.error = err*/
      );
  }

  deleteSalary(id) {
    this.resetErrors();
    this.employeeService.deleteSalary(id)
      .subscribe(
        (res: Salary[]) => {
          if (this.showList) {
            this.salaries = res;
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
