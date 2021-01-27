import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../services/custom_validators';
import { FormService } from '../services/form';
import { AuthService } from '../services/auth.service';

export const AUTH_TOKEN: string = 'jwt_token';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    title = 'Login';

    rForm: FormGroup;
    post: any;
    email = '';
    password = '';

    public user: any;

    constructor(private auth: AuthService,
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

    login(f) {
        let requestBody = new URLSearchParams();
        requestBody.set('username', f.email);
        requestBody.set('password', f.password);
        requestBody.set('grant_type', 'password');
        this.auth.login(requestBody);
    }
    
    /*CHECK IF THIS GETS USED - CHECK DATE: 2021-01-27 (feedback: Logic moved to AUTH)
    refreshToken() {
        this.userService.refreshToken();
    }*/
    
    logout() {
        this.auth.logout();
    }
}