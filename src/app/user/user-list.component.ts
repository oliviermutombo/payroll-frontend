import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from '../admin/employee/employee';
import { EmployeeService } from '../admin/employee.service';
import { UserService } from '../services/user.service';
import { DataService } from '../admin/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './user-list.component.html'
})

export class UserListComponent implements OnInit {
  title = 'payroll-system';

  employees: Employee[];
  showList = false;

  error = '';
  success = '';

  // Create de default constructor if possible.
  employee : any;//new Employee('', '', '', '', '', '', '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '');

  updateMode = false;

  constructor(private employeeService: EmployeeService,
              private userService: UserService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees(): any {
    this.employeeService.getAll().subscribe(
      (res: Employee[]) => {
        this.employees = res;
        this.showList = true; // added
      }
    );
  }

  getEmployee(id): void {
    this.employeeService.getEmployee(id).subscribe(
      (res: Employee) => {
        this.employee = res;
      }
    );
  }
}
