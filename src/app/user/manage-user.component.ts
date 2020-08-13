import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Employee } from '../admin/employee/employee';
import { ApiService } from 'src/app/admin/api.service';
import { UserService } from '../services/user.service'
import { CustomValidators } from '../services/custom_validators';
import { FormService } from '../services/form';
import { NotificationService } from '../services/notification.service';
import { Role } from '../user/role';
import { UtilitiesService } from '../services/utilities.service';
import * as globals from 'src/app/globals';
import { ConfirmationDialogService } from '../services/confirmation-dialog/confirmation-dialog.service';

@Component({
  templateUrl: './manage-user.component.html'
})

export class ManageUserComponent implements OnInit {

  title = 'payroll-system';

  // Create de default constructor if possible.
  employee : any;// = new Employee('TestEmpCode', 'TestFirst', 'TestLast', '', '', '', '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '');

  user = {
    'id': null,
    'firstName' : '',
    'lastName' : '',
    'email' : '',
    'username' : '',
    'employee': null,
    //'password' : '12345', // set in backend.
    'role' : [],
    'enabled': true,
    'accountNonExpired': true,
    'accountNonLocked': true,
    'credentialsNonExpired': true
  };

  empIdToEdit = 0;//////////////////////////////////

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;

  public formErrors = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    is_system_admin: '',
    is_payroll_admin: '',
    is_employee_admin: '',
    is_employee: ''
  };
  
stripRole(role) {
  return role.replace('ROLE_','');
}

  /* These role sets do not get triggered on updatemode - only on create mode*/
 checkSysAdmin($isChecked): void {
  if(!this.updateMode) {
    if ($isChecked) {
      this.user.role = this.utilitiesService.addToArray(this.user.role, this.stripRole(Role.ROLE_ADMIN));
    } else {
      this.user.role = this.user.role.filter(item => item !== this.stripRole(Role.ROLE_ADMIN));
    }
  }
}
checkPayrollAdmin($isChecked): void {
  if(!this.updateMode) {
    if ($isChecked) {
      this.user.role = this.utilitiesService.addToArray(this.user.role, this.stripRole(Role.ROLE_PAYROLL_ADMIN));
    } else {
      this.user.role = this.user.role.filter(item => item !== this.stripRole(Role.ROLE_PAYROLL_ADMIN));
    }
  }
}
checkEmployeeAdmin($isChecked): void {
  if(!this.updateMode) {
    if ($isChecked) {
      this.user.role = this.utilitiesService.addToArray(this.user.role, this.stripRole(Role.ROLE_EMPLOYEE_ADMIN));
    } else {
      this.user.role = this.user.role.filter(item => item !== this.stripRole(Role.ROLE_EMPLOYEE_ADMIN));
    }
  }
}
checkEmployee($isChecked): void {
  if(!this.updateMode) {
    if ($isChecked) {
      this.user.role = this.utilitiesService.addToArray(this.user.role, this.stripRole(Role.ROLE_EMPLOYEE));
    } else {
      this.user.role = this.user.role.filter(item => item !== this.stripRole(Role.ROLE_EMPLOYEE));
    }
  }
}

  constructor(private injector: Injector,
              private apiService: ApiService,
              private userService: UserService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private location: Location,
              private notification: NotificationService,
              private utilitiesService: UtilitiesService,
              private confirmationDialogService: ConfirmationDialogService,
              public formService: FormService) { // TRY PRIVATE

    this.rForm = fb.group({
      firstName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
      lastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50), CustomValidators.validateCharacters]],
      emailAddress: [null, [Validators.required, Validators.email]],
      is_system_admin: [null],
      is_payroll_admin: [null],
      is_employee_admin: [null],
      is_employee: [null],
      disabled: [null],
      accountExpired: [null],
      accountLocked: [null],
      credentialsExpired: [null]
    });

    // on each value change we call the validateForm function
    // We only validate form controls that are dirty, meaning they are touched
    // the result is passed to the formErrors object
    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    
    this.getEmployeeToEdit();
  }

  getEmployeeToEdit(): void {

    const queryParams = this.route.snapshot.queryParams
    //const routeParams = this.route.snapshot.params;
    //let empId = this.route.snapshot.paramMap.get('empId');
    //let userId = this.route.snapshot.paramMap.get('userId');

    let empId = queryParams['empId'];
    let userId = queryParams.userId;

    if (empId && !userId) {
      //empId = decodeURIComponent(empId);
      this.updateMode = false;
      let decryptedEmpId = this.utilitiesService.Decrypt(empId);
      this.populateForm(+decryptedEmpId);

    }else if (userId && empId) {
      //userId = decodeURIComponent(userId);
      this.updateMode = true;
      let decryptedUserId = +this.utilitiesService.Decrypt(userId);
      this.empIdToEdit = +this.utilitiesService.Decrypt(empId);
      this.populateFormToEdit(decryptedUserId);
    }
    
  }

  goBack(): void {
    this.location.back();
  }

  getEmployee(id): void {
    //this.employeeService.getEmployee(id).subscribe(
    this.apiService.getById(globals.EMPLOYEE_ENDPOINT, id).subscribe(
      (res: Employee) => {
        this.employee = res;
      }
    );
  }

  addUser(f) {
    if (this.employee.active){
      this.user.firstName = f.firstName;
      this.user.lastName = f.lastName;
      this.user.email = f.emailAddress;
      this.user.username = f.emailAddress;
      this.user.employee = this.utilitiesService.generateQuickIdObject(this.employee.id);
      if (this.user.role.length == 0) {
          this.notification.showError('No role(s) selected!');
      } else {
        this.userService.create(this.user)
          .subscribe(
            (res: any) => {
              if (res) {
                this.notification.showSaved();
              }
              // Reset the form
              this.rForm.reset();
            }
          );
      }
    } else {
      this.notifier.showError('This employee is inactive!');
    }
  }

  updateUser(f) {
    this.user.employee = this.utilitiesService.generateQuickIdObject(this.empIdToEdit)
    this.user.role = this.getEditedRoles(f);
    this.user.enabled = !f.disabled;
    this.user.accountNonExpired = !f.accountExpired;
    this.user.accountNonLocked = !f.accountLocked;
    this.user.credentialsNonExpired = !f.credentialsExpired;
    
    if (this.user.role.length == 0) {
      this.notification.showError('No role(s) selected!');
    } else {
      this.userService.updateUser(this.user)
        .subscribe(
          (res) => {
            this.notification.showSaved();
          }
        );
    }
  }

  resetAccountStatusForm() {
    this.rForm.controls.disabled.reset();
    this.rForm.controls.accountExpired.reset();
    this.rForm.controls.accountLocked.reset();
    this.rForm.controls.credentialsExpired.reset();
  }

  resetUser(userId) {
    this.apiService.saveOnly(globals.USER_ENDPOINT+'/reset', this.utilitiesService.generateQuickIdObject(userId)).subscribe(
      (res) => {
        this.notification.showSuccess('User password reset!');
        this.resetAccountStatusForm();
      }
    );
  }

  getEditedRoles(f){
    /* role sets for updatemode */
    let rolesArr = [];
    if (f.is_system_admin) this.utilitiesService.addToArray(rolesArr, this.stripRole(Role.ROLE_ADMIN));
    if (f.is_payroll_admin) this.utilitiesService.addToArray(rolesArr, this.stripRole(Role.ROLE_PAYROLL_ADMIN));
    if (f.is_employee_admin) this.utilitiesService.addToArray(rolesArr, this.stripRole(Role.ROLE_EMPLOYEE_ADMIN));
    if (f.is_employee) this.utilitiesService.addToArray(rolesArr, this.stripRole(Role.ROLE_EMPLOYEE));
    return rolesArr;
  }

  populateForm(id){
    //this.employeeService.getEmployee(id).subscribe(
    this.apiService.getById(globals.EMPLOYEE_ENDPOINT, id).subscribe(
      (res: any) => {
        //alert('populateForm(id)\n' + JSON.stringify(res));
        this.employee = res;
        this.rForm.setValue({
          firstName: this.employee.firstName,
          lastName: this.employee.lastName,
          emailAddress: this.employee.emailAddress,
          is_system_admin: null,
          is_payroll_admin: null,
          is_employee_admin: null,
          is_employee: null, // set to true by default.
          disabled: null,
          accountExpired: null,
          accountLocked: null,
          credentialsExpired: null
        });
      }
    );
  }

  populateFormToEdit(id){
    //this.userService.getUser(id).subscribe(
    this.apiService.getById(globals.USER_ENDPOINT, id).subscribe(
      (res: any) => {
        this.user = res.result;
        this.rForm.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          emailAddress: this.user.email,
          is_system_admin: this.hasRole(this.user['roles'], this.stripRole(Role.ROLE_ADMIN)),
          is_payroll_admin: this.hasRole(this.user['roles'], this.stripRole(Role.ROLE_PAYROLL_ADMIN)),
          is_employee_admin: this.hasRole(this.user['roles'], this.stripRole(Role.ROLE_EMPLOYEE_ADMIN)),
          is_employee: this.hasRole(this.user['roles'], this.stripRole(Role.ROLE_EMPLOYEE)),
          disabled: !this.user.enabled,
          accountExpired: !this.user.accountNonExpired,
          accountLocked: !this.user.accountNonLocked,
          credentialsExpired: !this.user.credentialsNonExpired
        });
      }
    );
  }

  hasRole(Obj: any, role: string) {
    let s = Obj.find(r=>r.name == role);
    if(this.utilitiesService.isObject(s)){
      if (s['name']==role) return true;//Second If is not needed
    }
    //return JSON.stringify(s);
    return false;
  }

  public openConfirmationDialog(id) {
    this.confirmationDialogService.confirm('Please confirm...', 'Are you sure you want to delete?')
    .then((confirmed) => {
      if (confirmed) this.deleteUser(id);
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  deleteUser(id) {
    this.userService.deleteUser(id)
      .subscribe(
        (res: boolean) => {
          this.notification.showDeleted();
        }
      );
      /*this.apiService.deleteOnly(globals.USER_ENDPOINT, id)
      .subscribe(
        (res: boolean) => {
          if (res) {
            this.notification.showDeleted();
          } else {
            this.notifier.showGenericError();
           }
        }
      );*/
    this.user = null;
    this.rForm.reset();
  }
}
