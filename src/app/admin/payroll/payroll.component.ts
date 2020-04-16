import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Payroll } from './payroll';
import { PayrollService } from './payroll.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { DataService } from '../data.service';
import { NotificationService } from '../../services/notification.service';
import { PayrollPeriod } from '../payrollPeriod/payrollPeriod'; // For dropdown
import { Deduction } from '../deduction/deduction';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html'
})

export class PayrollComponent implements OnInit {
  title = 'payroll-system';
  payrolls: Payroll[];
  error = '';
  success = '';
  payrollPeriods: PayrollPeriod[]; // For dropdown

  deductions: Deduction[];

  payroll = new Payroll(0,0,'',0);

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;
  payrollPeriod = 0;
  hod = 0;

  public formErrors = {
    payrollPeriod: '',
    payday: ''
  };

  constructor(private injector: Injector,
              private payrollService: PayrollService,
              private dataService: DataService,
              private fb: FormBuilder,
              public formService: FormService) {

    this.rForm = fb.group({
      payrollPeriod: [null, [Validators.required]],
      payday: [null, [Validators.required]]
    });

    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    this.getPayrollPeriods();
    this.getAllDeductions();
    if (this.showList) {
      this.getPayrolls();
    }
  }

  showHideList($isChecked): void {
    if ($isChecked) {
      if (!this.payrolls) {
        // Above Condition added to make the list available on demand. can't retrieve list if not defined (or it throws an error)
        this.getPayrolls();
      }
      this.showList = true;
    } else {
      this.showList = false;
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

  // for dropdown
  getPayrollPeriods(): void {
    this.dataService.getAllPayrollPeriods().subscribe(
      (res: PayrollPeriod[]) => {
        this.payrollPeriods = res;
      }
    );
  }

  getAllDeductions(): void {
    this.dataService.getAllDeductions().subscribe(
      (res: Deduction[]) => {
        this.deductions = res;
      }
    );
  }

  getPayrolls(): void {
    this.payrollService.getAllPayrolls().subscribe(
      (res: Payroll[]) => {
        this.payrolls = res;
      }
    );
  }

  getPayroll(id): void {
    this.payrollService.getPayroll(id).subscribe(
      (res: Payroll) => {
        this.payroll = res;
      }
    );
  }

  runPayroll(f) {
    this.resetErrors();

    //this.payroll.period = f.payrollPeriod;
    //this.payroll.payday = f.payday;

    //for validation
    const selectedPeriod = this.payrollPeriods.find((item) => {
        return +item.id === +f.payrollPeriod;
      });
    
    this.payrolls = [];//INIT
    if (this.monthYear(selectedPeriod.period) === this.monthYear(f.payday)) {
        //run
        for (let x = 0; x<this.deductions.length; x++){

            let employeeid = +this.deductions[x].employee.id;
            let monthly = +this.deductions[x].monthly;

            let tax = +this.deductions[x].tax;
            let medicalaid = +this.deductions[x].medicalaid;
            let retirement = +this.deductions[x].retirement;

            let net = monthly-tax-medicalaid-retirement;
            
            let payrollObj = new Payroll(0,0,'',0);
            payrollObj.payday = f.payday;
            payrollObj.period = f.payrollPeriod;
            payrollObj.employee = employeeid;
            payrollObj.net = +net;
            //alert(JSON.stringify(payrollObj));
            this.payrolls.push(payrollObj);
        }
        //alert(JSON.stringify(this.payrolls));

        //SAVE IT
        this.payrollService.storePayroll(this.payrolls)
        .subscribe(
            (res: any) => {
            // Inform the user
            this.success = 'Created successfully';
            this.notifier.showSuccess('Payroll ran successfully');//.showSaved();

            // Reset the form
            this.rForm.reset();
            }
        );

    } else {
        alert('Pay day must be in the selected period.');
    }

    /**/
  }

  /*payrollEdit(id) {
    this.payrollService.getPayroll(id).subscribe(
      (res: Payroll) => {
        this.payroll = res;
        this.rForm.setValue({
          name: this.payroll.name,
          payrollPeriod: this.payroll.payrollPeriod.id,
          hod: this.payroll.hod
        });
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updatePayroll(f) {
    this.resetErrors();
    this.payroll.name = f.name;
    this.payroll.payrollPeriod = f.payrollPeriod;
    this.payroll.hod = f.hod;
    this.payrollService.updatePayroll(this.payroll)
      .subscribe(
        (res) => {
          if (this.showList) {
            // Refresh the entire list because the update only returns the ID of the FK and not the entire FK object
            // for that reason we cannot replace the changed object with the FK object since we only have a reference ID.
            this.getPayrolls();
          }
          this.success = 'Updated successfully';
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }*/

  deletePayroll(id) {
    this.resetErrors();
    this.payrollService.deletePayroll(id)
      .subscribe(
        (res: Payroll[]) => {
          if (this.showList) {
            this.payrolls = res;
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
