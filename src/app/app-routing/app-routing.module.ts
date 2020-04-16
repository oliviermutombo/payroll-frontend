import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from '../user/login.component'; No longer needed here since it needs it's own view
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AppComponent } from '../app.component';
import { SalaryComponent } from '../admin/salary/salary.component';
import { CostcentreComponent } from '../admin/costcentre/costcentre.component';
import { DepartmentComponent } from '../admin/department/department.component';
import { PositionComponent } from '../admin/position/position.component';
import { ManageEmployeeComponent } from '../admin/employee/manage-employee.component';
import { EmployeeListComponent } from '../admin/employee/employee-list.component';
import { EmployeeDetailsComponent } from '../admin/employee/employee-details.component';
import { DeductionComponent } from '../admin/deduction/deduction.component';
import { PayrollPeriodComponent } from '../admin/payrollPeriod/payrollPeriod.component';
import { PayrollComponent } from '../admin/payroll/payroll.component';
import { UserListComponent } from '../user/user-list.component';
import { ManageUserComponent } from '../user/manage-user.component';

//emp
import { PayslipComponent } from '../employee/payslip/payslip.component';

import { GlobalErrorComponent }  from '../services/global-error.component'; 
import { PageNotFoundComponent }  from '../services/page-not-found.component'; //Trying

import { AuthGuard } from '../guards';
import { Role } from '../user/role';

const routes: Routes = [
  /*{
    path: 'login',
    component: LoginComponent,
  },*/
  {
    path: 'manage_employee', //create employee
    component: ManageEmployeeComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.employeeAdmin,] }
  },
  {
    path: 'manage_employee/:id',
    component: ManageEmployeeComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.employeeAdmin] }
  },
  {
    path: 'employee_list',
    component: EmployeeListComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.systemAdmin, Role.payrollAdmin, Role.employeeAdmin] }
  },
  {
    path: 'user_list',
    component: UserListComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.systemAdmin] }
  },
  {
    path: 'create_user/:id',
    component: ManageUserComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.systemAdmin] }
  },
  {
    path: 'edit_user/:_id',
    component: ManageUserComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.systemAdmin] }
  },
  {
    path: 'employee_details/:id',
    component: EmployeeDetailsComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.payrollAdmin, Role.employeeAdmin] }
  },
  {
    path: 'salary',
    component: SalaryComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.payrollAdmin] }
  },
  {
    path: 'costcentre',
    component: CostcentreComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.payrollAdmin] }
  },
  {
    path: 'department',
    component: DepartmentComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.employeeAdmin] }
  },
  {
    path: 'position',
    component: PositionComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.employeeAdmin] }
  },
  {
    path: 'deduction',
    component: DeductionComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.payrollAdmin] }
  },
  {
    path: 'payrollperiod',
    component: PayrollPeriodComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.payrollAdmin] }
  },
  {
    path: 'payroll',
    component: PayrollComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.payrollAdmin] }
  },
  {
    path: 'payslip',
    component: PayslipComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.employee] }
  },
  {
    path: 'payslip/:id',
    component: PayslipComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.employee] }
  },
  {
      path: '',
      component: DashboardComponent,
  },
	{
	   path: 'error',
	   component: GlobalErrorComponent
	},
  {
    path: '**',
    component: PageNotFoundComponent 
  }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
