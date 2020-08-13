import { Component, OnInit, Input, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Employee } from './employee';
import { Salary } from '../salary/salary';
import { ApiService } from 'src/app/admin/api.service';
import { UtilitiesService } from '../../services/utilities.service';
import * as globals from 'src/app/globals';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-employee-details',
  // selector: 'app-root',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
  /*template: `
    <h3>Child</h3>
    <p>Voici la betise from parent: {{ labetise }}</p>
  `*/
})
export class EmployeeDetailsComponent implements OnInit{

    employee: Employee;
    salary: Salary;

    encryptedEmpId = '';

    constructor(
      private injector: Injector,
      private route: ActivatedRoute,
      private apiService: ApiService,
      public utilitiesService: UtilitiesService,
      private confirmationDialogService: ConfirmationDialogService,
      private location: Location
    ) {}

    notifier = this.injector.get(NotificationService);

    ngOnInit(): void {
      this.getEmployee();
    }

    getEmployee(): void {
      this.encryptedEmpId = this.route.snapshot.paramMap.get('id');
      const id = +this.utilitiesService.Decrypt(this.encryptedEmpId);
      //this.employeeService.getEmployee(id)
      this.apiService.getById(globals.EMPLOYEE_ENDPOINT, id)
        .subscribe(
          employee => this.employee = employee/*,
          (err) => {
            this.error = err;
          }*/
        );
    }
    
    goBack(): void {
      this.location.back();
    }

    getSalary(id): Salary {
      
      //this.employeeService.getSalary(id).subscribe(
      this.apiService.getById(globals.SALARY_ENDPOINT, id).subscribe(
        (res: Salary) => {
          this.salary = res;
        }/*,
        (err) => {
          alert('error: ' + JSON.stringify(err));
          this.error = err;
        }*/
      );
      return this.salary;
    }

    public openConfirmationDialog(id) {
      this.confirmationDialogService.confirm('Please confirm...', 'Are you sure you want to delete?')
      .then((confirmed) => {
        if (confirmed) this.deleteEmployee(id);
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    deleteEmployee(id) {
      this.employee = null;
      //this.employeeService.delete(id)
      this.apiService.deleteOnly(globals.EMPLOYEE_ENDPOINT, id)
        .subscribe(
          (res: boolean) => {
            this.notifier.showDeleted();
          }/*,
          (err) => this.error = err*/
        );
    }
}
