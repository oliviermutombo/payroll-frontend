import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from './employee';
import { Salary} from '../salary/salary'; // For dropdown
import { EmployeeService } from '../employee.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import { DataService } from '../data.service';
import { Department } from '../department/department'; // For dropdown
import { Position } from '../position/position'; // For dropdown
import { UtilitiesService } from '../../services/utilities.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-root', // WHAT MUST THE SELECTOR BE???
  // selector: 'employee-list', // WHAT MUST THE SELECTOR BE???
  templateUrl: './employee-list.component.html'
})

export class EmployeeListComponent implements OnInit {
  title = 'payroll-system';

  employees: MatTableDataSource<Employee>;
  displayedColumns: string[] = ['firstName', 'lastName', 'emailAddress', 'manageColumn'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  error = '';
  success = '';

  // Create de default constructor if possible.
  employee = new Employee('', '', '', '', '', '', '', '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '');

  updateMode = false;

  constructor(private employeeService: EmployeeService,
              private utilitiesService: UtilitiesService,
              private dataService: DataService) {

  }

  ngOnInit() {
    this.getEmployees();
    //this.getSalaries();
    //this.getDepartments();
    //this.getPositions();
  }

  applyFilter(filterValue: string) {
    this.employees.filter = filterValue.trim().toLowerCase();

    if (this.employees.paginator) {
      this.employees.paginator.firstPage();
    }
  }

  getEmployees(): void {
    this.employeeService.getAll().subscribe(
      (res: Employee[]) => {
        this.employees = new MatTableDataSource(res);
        this.employees.paginator = this.paginator;
        this.employees.sort = this.sort;
      }/*,
      (err) => {
        this.error = err;
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

  encryptParam(empId): string{
    if (empId) {
      return this.utilitiesService.Encrypt(empId);
    } else return null;
  }

  /*getParamObject(empId){
    if (empId) {
      let param = {empId:this.encryptParam(empId)};
      return param;
    } else return null;
  }*/
  
  displayFn(employee?: Employee): string | undefined {
    return employee ? employee.firstName + ' ' + employee.lastName : undefined;
  }

  private resetErrors() {
    this.success = '';
    this.error   = '';
  }
}
