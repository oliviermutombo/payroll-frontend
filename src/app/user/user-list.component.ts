import { Component, OnInit } from '@angular/core';
import { Employee } from '../admin/employee/employee';
import { EmployeeService } from '../admin/employee.service';
import { UtilitiesService } from '../services/utilities.service';

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
              private utilitiesService: UtilitiesService) {
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

  encryptParams(EmpId, userId?): string{
    if (EmpId && userId) {
      return this.utilitiesService.Encrypt(userId + ' ' + EmpId);
    } else if (EmpId && !userId) {
      return this.utilitiesService.Encrypt(EmpId);
    } else return null;
  }

  /*getEditUrl(userId, EmpId) {
    return `/edit_user/${encodeURIComponent(this.encryptParams(userId,EmpId))}`;
  }
  getCreateUrl(EmpId) {
    return `/create_user/${encodeURIComponent(this.encryptParams(EmpId))}`;
  }*/

  getUserObject(empId, userId?){
    if (empId && userId) {
      let params = {empId:this.encryptParams(empId), userId:this.encryptParams(userId)};
      return params;
    } else if (empId && !userId) {
      let params = {empId:this.encryptParams(empId)};
      return params;
    }
  }
}
