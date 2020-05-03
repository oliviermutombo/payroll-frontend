import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CustomValidators } from '../services/custom_validators';
import { FormService } from '../services/form';
import { HttpClient, HttpHeaders } from '@angular/common/http';////////////////
import { environment } from './../../environments/environment';////////////////
import { map, mergeMap, take } from 'rxjs/operators';//////////////////

export const AUTH_TOKEN: string = 'jwt_token';

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
        private router: Router,
        private http: HttpClient) {

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

    /*login(f) {
        this.resetErrors();
        let requestBody = new URLSearchParams();
        requestBody.set('username', f.email);
        requestBody.set('password', f.password);
        requestBody.set('grant_type', 'password');
        //let submittedUser = {'username': f.email, 'password': f.password, 'grant_type': 'password'};
        //this.userService.login(submittedUser).subscribe(
        this.userService.login(requestBody).subscribe(
            (res: any) => {
                alert('BACK TO LOGIN COMPONENT');
                this.userService.getUserByUsername(f.email).subscribe(
                    (response: any) => {
                        alert('BACK TO LOGIN COMPONENT AFTER GETTING USERNAME');
                        this.userService.testing(response);
                    },
                    (err) => {
                        alert ('Ereur 1 yangoyo: ' + JSON.stringify(err));
                        this.error = err;
                    });
            },
            (err) => {
                alert ('Ereur 2 yangoyo: ' + JSON.stringify(err));
                this.error = err;
            }
        );
    }*/

    login(f) {
        this.resetErrors();
        let requestBody = new URLSearchParams();
        requestBody.set('username', f.email);
        requestBody.set('password', f.password);
        requestBody.set('grant_type', 'password');
        this.userService.login(requestBody);
    }

    /*__login(f) {
        this.resetErrors();
        let requestBody = new URLSearchParams();
        requestBody.set('username', f.email);
        requestBody.set('password', f.password);
        requestBody.set('grant_type', 'password');

        var apiUsername = environment.apiUsername;
        var apiPassword = environment.apiPassword;

        let httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + btoa(apiUsername + ':' + apiPassword),
                            observe:'response'
                      })
          };
        
        this.http.post<any>(this.userService.loginUrl, requestBody.toString(), httpOptions)
        .pipe(
          map( tokenResponseObj => {
            if (tokenResponseObj && tokenResponseObj['access_token']) {
              alert("* We have logged in!\ntokenResponseObj: " + JSON.stringify(tokenResponseObj) + "\n\nLet us save the token now");
    
              let token = tokenResponseObj['access_token'];
              const token_parts = token.split(/\./);
              const token_decoded = JSON.parse(window.atob(token_parts[1]));
              //this.token_expires = new Date(token_decoded.exp * 1000);
              this.userService.token_expires = new Date(token_decoded.exp * 1000);
              this.email = token_decoded.email;//Missing - not needed for now
              this.userService.username = token_decoded.user_name;
              
              localStorage.setItem(AUTH_TOKEN, token);
              localStorage.setItem('email', token_decoded.email);
              localStorage.setItem('token_expiry', String(new Date(token_decoded.exp * 1000)));
            }
            alert('** Token saved\nNow get userdetails(2nd call) for:\n' + this.userService.username);
            return this.userService.username;
          }),
          mergeMap( username => this.http.get<any>(`${this.userService.userUrl}/username/${username}`)),
          take(1)
        ).subscribe( userdetails => {
           alert('*** userdetails [NEVER NULL]: \n' + JSON.stringify(userdetails));
           //save to local storage (IS THIS USED?)
           localStorage.setItem('currentUser', JSON.stringify(userdetails));
           //guard
           this.userService.currentUserSubject.next(userdetails);
           alert('KUDOS IF THE DASHBOARD HAS NOT LOADED YET BY NOW.\nIT SHOULD LOAD NEXT');
        });
    }*/

    /*login(f) {
        this.resetErrors();

        let logincomplete = false;
        let userdatareceived = false;

        if (logincomplete==false) {
            let requestBody = new URLSearchParams();
            requestBody.set('username', f.email);
            requestBody.set('password', f.password);
            requestBody.set('grant_type', 'password');

            var apiUsername = environment.apiUsername;
            var apiPassword = environment.apiPassword;

            let httpOptions = {
                headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': 'Basic ' + btoa(apiUsername + ':' + apiPassword),
                                observe:'response'
                        })
            };
            
            this.http.post<any>(this.userService.loginUrl, requestBody.toString(), httpOptions)
            .pipe(
            map( tokenResponseObj => {
                if (tokenResponseObj && tokenResponseObj['access_token']) {
                alert("* We have logged in!\ntokenResponseObj: " + JSON.stringify(tokenResponseObj) + "\n\nLet us save the token now");
        
                let token = tokenResponseObj['access_token'];
                const token_parts = token.split(/\./);
                const token_decoded = JSON.parse(window.atob(token_parts[1]));
                //this.token_expires = new Date(token_decoded.exp * 1000);
                this.userService.token_expires = new Date(token_decoded.exp * 1000);
                this.email = token_decoded.email;//Missing - not needed for now
                this.userService.username = token_decoded.user_name;
                
                localStorage.setItem(AUTH_TOKEN, token);
                localStorage.setItem('email', token_decoded.email);
                localStorage.setItem('token_expiry', String(new Date(token_decoded.exp * 1000)));
                }
                alert('** Token saved\nNow get userdetails(2nd call) for:\n' + this.userService.username);
                return this.userService.username;
            }),
            mergeMap( username => this.http.get<any>(`${this.userService.userUrl}/username/${username}`)),
            take(1)
            ).subscribe( userdetails => {
            alert('*** userdetails [NEVER NULL]: \n' + JSON.stringify(userdetails));
            //save to local storage (IS THIS USED?)
            localStorage.setItem('currentUser', JSON.stringify(userdetails));
            //guard
            this.userService.currentUserSubject.next(userdetails);
            alert('KUDOS IF THE DASHBOARD HAS NOT LOADED YET BY NOW.\nIT SHOULD LOAD NEXT');
            });
            
            ///////
            logincomplete = true;
        }

        if (userdatareceived == false){
            this.userService.setUserDetails(f.email);
            let userdata = this.userService.currentUser.source['_value'];
            alert('login.comp - userdata for ' + f.email +':\n' + userdata);
            if (userdata) {
                userdatareceived = true;
            } else {
                this.login(f);
            }
        }

        alert('BACK TO LOGIN COMPONENT');
    }*/
    
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