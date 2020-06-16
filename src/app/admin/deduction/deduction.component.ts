import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Deduction } from './deduction';
import { DeductionService } from './deduction.service';
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { ApiService } from 'src/app/admin/api.service';
import * as globals from 'src/app/globals';

@Component({
  selector: 'app-deduction',
  templateUrl: './deduction.component.html'
})

export class DeductionComponent implements OnInit {
  title = 'payroll-system';
  deductions: Deduction[];
  error = '';
  success = '';

  deduction = new Deduction(null, 0, 0, 0, 0, 0);
  
  employees = [];

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;
  //name = '';

  public formErrors = {
    employee: '',
    annual: '',
    monthly: '',
    tax: '',
    medicalaid: '',
    retirement: ''
  };

  taxTable = [
    {"lower": 0, "higher": 195850.01,"percentage":0},
    {"lower": 195850.01, "higher": 305850.01,"percentage":26},
    {"lower": 305850.01, "higher": 423300.01,"percentage":31},
    {"lower": 423300.01, "higher": 555600.01,"percentage":36},
    {"lower": 555600.01, "higher": 708310.01,"percentage":39},
    {"lower": 708310.01, "higher": 1500000.01,"percentage":41},
    {"lower": 1500000.01, "higher": null,"percentage":45}
];

  constructor(private injector: Injector,
    private deductionService: DeductionService,
    private apiService: ApiService,
    private fb: FormBuilder,
    public formService: FormService) {

    this.rForm = fb.group({
        employee: [null, Validators.required],
        annual: [null, Validators.required],
        monthly: [null, Validators.required],
        tax: [null, [Validators.required, Validators.pattern('^[0-9]+(?:\.[0-9]+)?$')]],
        medicalaid: [null, [Validators.required, Validators.pattern('^[0-9]+(?:\.[0-9]+)?$')]],
        retirement: [null, [Validators.required, Validators.pattern('^[0-9]+(?:\.[0-9]+)?$')]]
    });

    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    if (!this.updateMode) {
        this.getEmployees();
    }
    if (this.showList) {
        this.getDeductions();
    }
  }

  changeEmployee(e) {
    let selectedId = e.target.value
    const selectedEmployee = this.employees.find((item) => {
        return +item.id === +selectedId;
      });
    this.setSalary(selectedEmployee);
  }

  setSalary(_selectedEmployee) {
    let basicpay = 0;
    if (_selectedEmployee.basicpay) {
        basicpay = _selectedEmployee.basicpay;
    } else {
        basicpay = _selectedEmployee.paygrade.basicpay;
    }
    let basicpayMonthly = this.roundToTwo(basicpay/12);
    this.rForm.patchValue({
        annual: basicpay,
        monthly: basicpayMonthly
    });
    this.setTax(basicpay, basicpayMonthly);
  }

  setTax(_basicPay, _basicpayMonthly) {
    let taxPerc = 0;
    for (let i=0; i<this.taxTable.length; i++) {
        if (this.taxTable[i].higher != null) {
            if ((_basicPay >= this.taxTable[i].lower) && (_basicPay < this.taxTable[i].higher)) {
                taxPerc = this.taxTable[i].percentage;
            }
        } else if (this.taxTable[i].higher === null) {
            if (_basicPay >= this.taxTable[i].lower) {
                taxPerc = this.taxTable[i].percentage;
            }
        }       
    }
    const tax = this.roundToTwo((_basicpayMonthly*taxPerc)/100);
    this.rForm.patchValue({
        tax: tax
    });
  }

  roundToTwo(x){
    return Math.round((x) * 100) / 100;
  }

  showHideList($isChecked): void {
    if ($isChecked) {
      if (!this.deductions) {
        // Above Condition added to make the list available on demand. can't retrieve list if not defined (or it throws an error)
        this.getDeductions();
      }
      this.showList = true;
    } else {
      this.showList = false;
    }
  }
  // for dropdown
  getEmployees(): void {
    //this.employeeService.getAll().subscribe(
    this.apiService.getAll(globals.EMPLOYEE_ENDPOINT).subscribe(
      (res: any) => {
        this.employees = res;
      }
    );
  }

  getDeductions(): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.deductionService.getAllDeductions().subscribe(
      (res: Deduction[]) => {
        this.deductions = res;
      }
    );
  }

  getDeduction(id): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.deductionService.getDeduction(id).subscribe(
      (res: Deduction) => {
        this.deduction = res;
      }
    );
  }

  addDeduction(f) {
    this.resetErrors();
    let deduction = new Deduction();
    deduction.employee = f.employee;//
    deduction.tax = f.tax;
    deduction.annual = f.annual;
    deduction.monthly = f.monthly;
    deduction.medicalaid = f.medicalaid;
    deduction.retirement = f.retirement;

    this.deductionService.storeDeduction(deduction)
      .subscribe(
        (res: Deduction[]) => {
          // Update the list of deductions
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.deductions = res;
          }
          // Inform the user
          this.success = 'Created successfully';
          this.notifier.showSaved();
          // Reset the form
          this.rForm.reset();
        }
      );
  }

  deductionEdit(id) {
    this.deductionService.getDeduction(id).subscribe(
      (res: Deduction) => {
        this.deduction = res;
        this.rForm.setValue({
            employee: this.deduction.employee.id,
            tax: this.deduction.tax,
            annual: this.deduction.annual,
            monthly: this.deduction.monthly,
            medicalaid: this.deduction.medicalaid,
            retirement: this.deduction.retirement
        });
        this.rForm.get('employee').disable();
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updateDeduction(f) {
    this.resetErrors();
    this.deduction.employee = f.employee;
    this.deduction.tax = f.tax;
    this.deduction.annual = f.annual;
    this.deduction.monthly = f.monthly;
    this.deduction.medicalaid = f.medicalaid;
    this.deduction.retirement = f.retirement;
    this.deductionService.updateDeduction(this.deduction)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.deductions = res;
          }
          this.success = 'Updated successfully';
          this.deduction = new Deduction();
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.get('employee').enable();
          this.rForm.reset();
        }
      );
  }

  deleteDeduction(id) {
    this.resetErrors();
    this.deductionService.deleteDeduction(id)
      .subscribe(
        (res: Deduction[]) => {
          if (this.showList) {
            this.deductions = res;
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
