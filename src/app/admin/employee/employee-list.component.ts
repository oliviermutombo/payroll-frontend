import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from './employee';
import { Salary} from '../salary/salary'; // For dropdown
import { EmployeeService } from '../employee.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { DataService } from '../data.service';
import { Department } from '../department/department'; // For dropdown
import { Position } from '../position/position'; // For dropdown

@Component({
  selector: 'app-root', // WHAT MUST THE SELECTOR BE???
  // selector: 'employee-list', // WHAT MUST THE SELECTOR BE???
  templateUrl: './employee-list.component.html'
})

export class EmployeeListComponent implements OnInit {
  title = 'payroll-system';

  employees: Employee[];
  showList = false;

  error = '';
  success = '';

  // Create de default constructor if possible.
  employee = new Employee('', '', '', '', '', '', '', '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '');

  updateMode = false;

  constructor(private employeeService: EmployeeService,
              private dataService: DataService) {

  }

  ngOnInit() {
    this.getEmployees();
    //this.getSalaries();
    //this.getDepartments();
    //this.getPositions();
  }

  getEmployees(): void {
    this.employeeService.getAll().subscribe(
      (res: Employee[]) => {
        this.employees = res;
        this.showList = true; // added
      }/*,
      (err) => {
        this.error = err;
        this.showList = false; // added
      }*/
    );
  }

  getEmployee(id): void {
    this.employeeService.getEmployee(id).subscribe(
      (res: Employee) => {
        this.employee = res;
      }/*,
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.error = err;
      }*/
    );
  }
  /* I no longer want delete option on employee list (because the rendering may take long considering No of employees)
  deleteEmployee(id) {
    this.resetErrors();
    this.employeeService.delete(id)
      .subscribe(
        (res: boolean) => {
          // this.employees = res;
          this.success = 'Deleted successfully';
        },
        (err) => this.error = err
      );
  }*/

  private resetErrors() {
    this.success = '';
    this.error   = '';
  }
}
