import { Component, OnInit } from '@angular/core';
import { DataService } from './admin/data.service';
import { UserService } from './services/user.service';
import { CostcentreService } from './admin/costcentre/costcentre.service';
import { DepartmentService } from './admin/department/department.service';
import { PositionService } from './admin/position/position.service';
import { EmployeeService } from './admin/employee.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'payroll-system';

  error = '';
  success = '';

  constructor(private userService: UserService,
              private costcentreService: CostcentreService,
              private departmentService: DepartmentService,
              private positionService: PositionService,
              private employeeService: EmployeeService,
              private router: Router) {
    
              //this.userService.hasRole('');
  }

  ngOnInit() {
    //alert('########### APP.COMP... INIT');
  }

  hasRole(_role) {
    return this.userService.hasRole(_role);//Checks roles of current user
  }
  
  logout() {
    this.userService.logout();
  }
}
