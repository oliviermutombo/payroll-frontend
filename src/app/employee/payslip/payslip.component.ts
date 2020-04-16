import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PayslipService } from './payslip.service';
import { DataService } from '../../admin/data.service';
import { PayrollPeriod } from '../../admin/payrollPeriod/payrollPeriod';
import { DeductionService } from '../../admin/deduction/deduction.service';
import { Deduction } from '../../admin/deduction/deduction';

import { UserService } from '../../services/user.service';

@Component({
    templateUrl: './payslip.component.html'
  })
  export class PayslipComponent implements OnInit{

    constructor(
        private route: ActivatedRoute,
        private payslipService: PayslipService,
        private dataService: DataService,
        private userService: UserService,
        private deductionService: DeductionService,
        private fb: FormBuilder,
        private location: Location
      ) {

        this.rForm = fb.group({
            payrollPeriod: [null, [Validators.required]]
        });

    }
    
    payslip: any;
    deduction = new Deduction(null,null,null,null,null,null);
    payrollPeriods: PayrollPeriod[];
    rForm: FormGroup;

    ngOnInit(): void {
        this.getPayrollPeriods();
        
        let empid = this.userService.currentUserValue.employeeid;
        if (empid) {
        this.getDeductions(empid);
        } else {
            alert('This user is not an employee');
        }
        //alert(JSON.stringify(this.userService.currentUserValue));
        //this.getPayslip();
    }

    idOrPassport(): {} {
      if (this.payslip.employee.idnumber) {
        return {'name': 'ID number', 'value': this.payslip.employee.idnumber};
      } else {
        return {'name': 'Passport number', 'value': this.payslip.employee.passportno};
      }
    }

    changePeriod(e) {
        let selectedId = e.target.value
        this.getPayslip(selectedId);
    }

    getPayslip(periodId): void {
        this.payslipService.getPayslip(periodId)
        .subscribe(
            payslip => this.payslip = payslip);
    }

    getDeductions(empid): void {
        this.deductionService.getEmployeeDeduction(empid)
        .subscribe(
            (res: Deduction) => {
                this.deduction = res;
                //alert('dd: ' + JSON.stringify(this.deduction));
            }
          );
    }

    getTotalDeductions(){
        let tax = +this.deduction.tax;
        let retirement = +this.deduction.retirement;
        let medicalaid = +this.deduction.medicalaid;
        let tot = tax+retirement+medicalaid;
        return tot;
    }
    /*getPayslip(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        if(id>0) {
            this.payslipService.getPayslip(id)
            .subscribe(
                payslip => this.payslip = payslip);
        }
    }*/
    
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

  }