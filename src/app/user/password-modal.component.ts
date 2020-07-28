import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../services/custom_validators';
import { FormService } from '../services/form';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-form-modal',
    templateUrl: './password-modal.component.html'
})

export class PasswordModalComponent {
  @Input()id: number;
  myForm: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private userService: UserService,
    private injector: Injector,
    private notification: NotificationService
  ) {
    this.createForm();
  }
  private createForm() {
    this.myForm = this.formBuilder.group({
      newPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(50), CustomValidators.validateCharacters]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(50), CustomValidators.validateCharacters]]
    });

    this.myForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.myForm, this.formErrors, true);
    });
  }
  public formErrors = {
    newPassword: '',
    confirmPassword: ''
  };

  update(f) {
    if (f.newPassword != f.confirmPassword) {
      alert("Passwords must be the same!");
    } else {
      let requestObj = {};
      requestObj['newPassword'] = f.newPassword;

      this.userService.updatePassword(requestObj)
      .subscribe(
      (res) => {
          this.notification.showSuccess("Password updated.");
          this.activeModal.close(this.myForm.value);
      }
      );
    }
  }
}