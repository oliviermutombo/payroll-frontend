import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { ManageEmployeeComponent } from './manage-employee.component';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeDetailsComponent } from './employee-details.component'; // new

import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';

let schemas: any[] = [];
schemas.push(CUSTOM_ELEMENTS_SCHEMA);

@NgModule({
  declarations: [
    ManageEmployeeComponent,
    EmployeeListComponent,
    EmployeeDetailsComponent
  ],
  exports: [ManageEmployeeComponent], // Added
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule // New
  ],
  providers: [ CustomValidators, FormService ],
  bootstrap: [ManageEmployeeComponent],
  schemas: schemas
})
export class ManageEmployeeModule { }
