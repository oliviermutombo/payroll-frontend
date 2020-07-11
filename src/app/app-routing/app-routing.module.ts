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
import { CountryComponent } from '../admin/countries/country.component';
import { UserListComponent } from '../user/user-list.component';
import { ManageUserComponent } from '../user/manage-user.component';
import { CompanyComponent } from '../admin/company/company.component';
import { PersonalDetailsComponent } from '../employee/details/personal-details.component';

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
    data: { roles: [Role.ROLE_EMPLOYEE_ADMIN,] }
  },
  {
    path: 'manage_employee/:id',
    component: ManageEmployeeComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_EMPLOYEE_ADMIN] }
  },
  {
    path: 'employee_list',
    component: EmployeeListComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_ADMIN, Role.ROLE_PAYROLL_ADMIN, Role.ROLE_EMPLOYEE_ADMIN] }
  },
  {
    path: 'user_list',
    component: UserListComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_ADMIN] }
  },
  {
    path: 'manage_user',
    component: ManageUserComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_ADMIN] }
  },
  {
    path: 'create_user/:empId',
    component: ManageUserComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_ADMIN] }
  },
  {
    path: 'edit_user/:emp_userIds',
    component: ManageUserComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_ADMIN] }
  },
  {
    path: 'employee_details/:id',
    component: EmployeeDetailsComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_PAYROLL_ADMIN, Role.ROLE_EMPLOYEE_ADMIN] }
  },
  {
    path: 'salary',
    component: SalaryComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_PAYROLL_ADMIN] }
  },
  {
    path: 'costcentre',
    component: CostcentreComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_PAYROLL_ADMIN] }
  },
  {
    path: 'department',
    component: DepartmentComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_EMPLOYEE_ADMIN] }
  },
  {
    path: 'position',
    component: PositionComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_EMPLOYEE_ADMIN] }
  },
  {
    path: 'countries',
    component: CountryComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_EMPLOYEE_ADMIN] }
  },
  {
    path: 'company_details',
    component: CompanyComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_EMPLOYEE_ADMIN] }
  },
  {
    path: 'deduction',
    component: DeductionComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_PAYROLL_ADMIN] }
  },
  {
    path: 'payrollperiod',
    component: PayrollPeriodComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_PAYROLL_ADMIN] }
  },
  {
    path: 'payroll',
    component: PayrollComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_PAYROLL_ADMIN] }
  },
  {
    path: 'payslip',
    component: PayslipComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_EMPLOYEE] }
  },
  {
    path: 'employee/payslip/:id',
    component: PayslipComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_EMPLOYEE] }
  },
  {
    path: 'employee/self',
    component: PersonalDetailsComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Role.ROLE_EMPLOYEE] }
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
