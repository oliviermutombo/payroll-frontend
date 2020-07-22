import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../admin/api.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { UtilitiesService } from '../services/utilities.service';
import { FormService } from '../services/form';
import { CustomValidators } from '../services/custom_validators';
import * as globals from 'src/app/globals';
import { AuthService } from '../services/auth.service';


@Component({
    templateUrl: './settings.component.html'
})

export class SettingsComponent implements OnInit {

    PasswordForm: FormGroup;

    constructor(private injector: Injector,
        private apiService: ApiService,
        private userService: UserService,
        private auth: AuthService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private notification: NotificationService,
        private utilitiesService: UtilitiesService,
        private formService: FormService) {

        this.PasswordForm = fb.group({
            currentPassword: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
            newPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(50), CustomValidators.validateCharacters]],
            confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(50), CustomValidators.validateCharacters]]
        });

        // on each value change we call the validateForm function
        // We only validate form controls that are dirty, meaning they are touched
        // the result is passed to the formErrors object
        this.PasswordForm.valueChanges.subscribe((data) => {
        this.formErrors = this.formService.validateForm(this.PasswordForm, this.formErrors, true);
        });
    }

    public formErrors = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    ngOnInit() {
    }

    changePassword(f) {

        var warning = [];
        if (f.currentPassword == f.newPassword) {
            warning.push("New password must be different from current!");
        }
        if (f.newPassword != f.confirmPassword) {
            warning.push("Wrong confirm password!");
        }
        if (warning.length>0) {
            let warningMessage ='';
            warning.forEach(function (value) {
                warningMessage += '- ' + value +'\n';
            }); 
            alert(warningMessage);
        } else {
            let requestObj = {};
            requestObj['username'] = this.auth.currentUserValue.username;
            requestObj['currentPassword'] = f.currentPassword;
            requestObj['newPassword'] = f.newPassword;
            requestObj['confirmPassword'] = f.confirmPassword;

            this.userService.updatePassword(requestObj)
            .subscribe(
            (res) => {
                this.notification.showSaved();
            }
            );
        }
        this.PasswordForm.reset();
    }

    getRoles() {
        return this.auth.currentUserValue.roles;
    }
}