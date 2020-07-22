import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { LoginComponent } from './user/login.component';
import { SalaryComponent } from './admin/salary/salary.component';
import { CostcentreComponent } from './admin/costcentre/costcentre.component';
import { DepartmentComponent } from './admin/department/department.component';
import { PositionComponent } from './admin/position/position.component';
import { EmployeeListComponent } from './admin/employee/employee-list.component'; // Not sure about this one!
import { EmployeeDetailsComponent } from './admin/employee/employee-details.component'; // New
import { ManageEmployeeComponent } from './admin/employee/manage-employee.component';
import { DeductionComponent } from './admin/deduction/deduction.component';
import { PayrollPeriodComponent } from './admin/payrollPeriod/payrollPeriod.component';
import { PayrollComponent } from './admin/payroll/payroll.component';
import { CountryComponent } from './admin/countries/country.component';
import { CompanyComponent } from './admin/company/company.component';
import { UserListComponent } from './user/user-list.component';
import { ManageUserComponent } from  './user/manage-user.component';

//emp
import { PayslipComponent } from './employee/payslip/payslip.component';
import { PersonalDetailsComponent } from './employee/details/personal-details.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { GlobalErrorComponent }  from './services/global-error.component';
import { PageNotFoundComponent }  from './services/page-not-found.component'; 
import { AppRoutingModule } from './app-routing/app-routing.module';

import { CustomValidators } from './services/custom_validators';
import { FormService } from './services/form';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // new
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/TokenInterceptor'; ///////////
import { AuthInterceptor } from './services/auth-request';

import { GlobalErrorHandlerService } from './services/global-error-handler.service';

//pagination
import { AngularmaterialModule } from './material/angularmaterial/angularmaterial.module';
import { PositionService } from './admin/position/position.service';

import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { AuthService } from './services/auth.service';
import { SettingsComponent } from './user/settings.component';


let schemas: any[] = [];
schemas.push(CUSTOM_ELEMENTS_SCHEMA);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SalaryComponent,
    CostcentreComponent,
    DepartmentComponent,
    PositionComponent,
    DashboardComponent,
    EmployeeDetailsComponent,
    EmployeeListComponent,
    ManageEmployeeComponent,
    DeductionComponent,
    PayrollPeriodComponent,
    PayrollComponent,
    PayslipComponent,
    PersonalDetailsComponent,
    UserListComponent,
    ManageUserComponent,
    CountryComponent,
    CompanyComponent,
    GlobalErrorComponent,
    SettingsComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    AngularmaterialModule, //pagination
    MatAutocompleteModule,
    MatInputModule,
    AppRoutingModule
  ],
  providers: [ 
    UserService,
    AuthService,
    CustomValidators,
    FormService,
    PositionService, //pagination
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },*/
    GlobalErrorHandlerService,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  bootstrap: [AppComponent],
  schemas: schemas
})
export class AppModule { }
