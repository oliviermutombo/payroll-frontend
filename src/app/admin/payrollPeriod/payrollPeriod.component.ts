import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { PayrollPeriod } from './payrollPeriod';
import { PayrollPeriodService } from './payrollPeriod.service';
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';

@Component({
  selector: 'app-payrollPeriod',
  templateUrl: './payrollPeriod.component.html'
})

export class PayrollPeriodComponent implements OnInit {
  title = 'payroll-system';
  payrollPeriods: PayrollPeriod[];
  error = '';
  success = '';

  payrollPeriod = new PayrollPeriod('', 0);

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;
  period = '';

  public formErrors = {
    period: ''
  };

  constructor(private injector: Injector,
    private payrollPeriodService: PayrollPeriodService,
    private fb: FormBuilder,
    public formService: FormService) {

    this.rForm = fb.group({
      period: [null, [Validators.required, CustomValidators.DateOfBirth, CustomValidators.PayrollPeriodDate]],
    });

    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    if (this.showList) {
      this.getPayrollPeriods();
    }
  }

  monthYear(d): string {//dup
    d = new Date(d);

    const monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ];

    let mm =  monthNames[d.getMonth()];
    let yyyy = d.getFullYear();
    return mm + ' ' + yyyy;
  }
  
  showHideList($isChecked): void {
    if ($isChecked) {
      if (!this.payrollPeriods) {
        // Above Condition added to make the list available on demand. can't retrieve list if not defined (or it throws an error)
        this.getPayrollPeriods();
      }
      this.showList = true;
    } else {
      this.showList = false;
    }
  }
  getPayrollPeriods(): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.payrollPeriodService.getAllPayrollPeriods().subscribe(
      (res: PayrollPeriod[]) => {
        this.payrollPeriods = res;
      }
    );
  }

  getPayrollPeriod(id): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.payrollPeriodService.getPayrollPeriod(id).subscribe(
      (res: PayrollPeriod) => {
        this.payrollPeriod = res;
      }
    );
  }

  addPayrollPeriod(f) {
    this.resetErrors();

    this.payrollPeriod.period = f.period;

    this.payrollPeriodService.storePayrollPeriod(this.payrollPeriod)
      .subscribe(
        (res: PayrollPeriod[]) => {
          // Update the list of payrollPeriods
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.payrollPeriods = res;
          }
          // Inform the user
          this.success = 'Created successfully';
          this.notifier.showSaved();
          // Reset the form
          this.rForm.reset();
        }
      );
  }

  payrollPeriodEdit(id) {
    this.payrollPeriodService.getPayrollPeriod(id).subscribe(
      (res: PayrollPeriod) => {
        this.payrollPeriod = res;
        this.rForm.setValue({
          period: this.payrollPeriod.period,
        });
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updatePayrollPeriod(f) {
    this.resetErrors();
    this.payrollPeriod.period = f.period;
    this.payrollPeriodService.updatePayrollPeriod(this.payrollPeriod)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.payrollPeriods = res;
          }
          this.success = 'Updated successfully';
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  deletePayrollPeriod(id) {
    this.resetErrors();
    this.payrollPeriodService.deletePayrollPeriod(id)
      .subscribe(
        (res: PayrollPeriod[]) => {
          if (this.showList) {
            this.payrollPeriods = res;
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
