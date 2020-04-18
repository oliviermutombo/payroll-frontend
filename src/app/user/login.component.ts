import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CustomValidators } from '../services/custom_validators';
import { FormService } from '../services/form';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    title = 'Login';

    error = '';
    success = '';

    rForm: FormGroup;
    post: any;
    email = '';
    password = '';

    public user: any;

    constructor(private userService: UserService,
        private fb: FormBuilder,
        public formService: FormService,
        private router: Router) {

        this.rForm = fb.group({
            email: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
            password: [null, [Validators.required]]
        });
                
    }

    ngOnInit() {
        this.user = {
        email: '',
        password: ''
        };
    }

    /*login(f) {
        this.resetErrors();
        //this.userService.login({'email': f.email, 'password': f.password});
        let submittedUser = {'email': f.email, 'password': f.password};
        this.userService.login(submittedUser).subscribe(
            (res: any) => {
                
            }//,
            //(err) => {
            //    alert ('Ereur yangoyo: ' + JSON.stringify(err));
            //    this.error = err;
            //}
        );
    } v0 */

    login(f) {
        this.resetErrors();
        let requestBody = new URLSearchParams();
        requestBody.set('username', f.email);
        requestBody.set('password', f.password);
        requestBody.set('grant_type', 'password');
        //let submittedUser = {'username': f.email, 'password': f.password, 'grant_type': 'password'};
        //this.userService.login(submittedUser).subscribe(
        this.userService.login(requestBody).subscribe(
            (res: any) => {
                
            },
            (err) => {
                alert ('Ereur yangoyo: ' + JSON.stringify(err));
                this.error = err;
            }
        );
    }
    
    refreshToken() {
        this.userService.refreshToken();
    }
    
    logout() {
        this.userService.logout();
    }

    private resetErrors() {
        this.success = '';
        this.error   = '';
    }
}