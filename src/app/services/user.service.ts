import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { environment } from './../../environments/environment';

//guard

import { User } from '../user/user'

export const AUTH_TOKEN: string = 'jwt_token';


 
// @Injectable()
@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  isSytemAdmin = true;

  baseUrl = environment.apiUrl;
  apiVersion = environment.apiVersion;

  //loginUrl = this.baseUrl + '/obtain-token/'; //v0
  loginUrl = this.baseUrl + '/oauth/token';
  userUrl = this.baseUrl + this.apiVersion + '/users';


  tokenRefreshUrl = this.baseUrl + '/api-token-refresh/';
  createUrl = this.baseUrl + '/create-user';
  getUrl = this.baseUrl + '/get-user';
  updateUrl = this.baseUrl + '/update-user';
  deleteUrl = this.baseUrl + '/delete-user';
  existsUrl = this.baseUrl + '/user-exists';
 
  // http options used for making API calls
  private httpOptions: any;
 
  // the actual JWT token
  // public token: string;
 
  // the token expiration date
  public token_expires: Date;
 
  // the email of the logged in user
  public email: string;

  // v1 username of the logged in user
  public username: string;
  // v1 roles of the logged in user
  public rolesArr: any;
  // v1
  public userObj = new User();
 
  // error messages received from the login attempt.
  public error: any = [];

  public success: any;

  public tokenExpired = false;

  //guard
  //private currentUserSubject: BehaviorSubject<User>;
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
 
  constructor(private http: HttpClient) {
    //guard
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    var apiUsername = environment.apiUsername;
    var apiPassword = environment.apiPassword;

    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                      'Authorization': 'Basic ' + btoa(apiUsername + ':' + apiPassword),
                      observe:'response'
                })
    };

    //roles
    this.isSytemAdmin = true;
    //alert('this.currentUser: ' + JSON.stringify(this.currentUser.source._value.role));
    //alert('this.currentUser: ' + JSON.stringify(this.currentUser));
  }

  /*public hasRole(_role) { //preferred technique because it pulls value from Observalable/BehaviorSubject
    let rolesArr = this.currentUser.source['_value'].role;
    //alert('rolesArr!: ' + JSON.stringify(rolesArr));
    if (rolesArr) {
      if (rolesArr.indexOf(_role) > -1){
        return true;
      }
    }
    return false;
  } // v0 */

  public hasRole(_role) { //preferred technique because it pulls value from Observalable/BehaviorSubject
    //alert('++ hasRole ++\n looking for role: '+ _role + '\n current user role(s): ' + this.rolesArr);
    let userdetails = this.currentUser.source['_value'];
    //alert('Checking roles:\n' + JSON.stringify(userdetails));
    //alert('currentUserSubject\n' + JSON.stringify(this.currentUserSubject));
    let rolesArr = null;
    if (userdetails) {
      rolesArr = this.currentUser.source['_value'].roles;
      //alert('rolesArr: \n' + JSON.stringify(rolesArr));
    }
    
    if (rolesArr) {
      //alert('rolesArr: \n' + JSON.stringify(rolesArr));
      if (rolesArr.indexOf(_role) > -1){
        //alert('User ' + userdetails.username + ' has ' + _role + '\nuserdetails: ' + JSON.stringify(userdetails));
        return true;
      }
    }
    //alert('hasRole('+ _role +') -  this.currentUser' + JSON.stringify(this.currentUser));
    return false;
  }

  //guard
  public get currentUserValue(): User {
    //alert('this.currentUserSubject.value: ' + JSON.stringify(this.currentUserSubject.value))
    return this.currentUserSubject.value;
  }

  /*login(requestBody: any):  Observable<any> {
    return this.http.post<any>(this.loginUrl, requestBody.toString(), this.httpOptions)
    .pipe(map((userData) => {
      if (userData && userData['token']) {
        this.updateData(userData);
      }
      return userData;
    }));
  } v0 */

  /*login(requestBody: any):  Observable<any> {
    let self = this;
    return this.http.post<any>(this.loginUrl, requestBody.toString(), this.httpOptions)
    .pipe(map((tokenResponseObj) => {
      //alert("tokenResponseObj: " + JSON.stringify(tokenResponseObj));
      if (tokenResponseObj && tokenResponseObj['access_token']) {
        //this.updateData(tokenResponseObj);
        //alert('3. this.currentUserSubject: ' + JSON.stringify(this.currentUserSubject));

        alert("* We have logged in!\ntokenResponseObj: " + JSON.stringify(tokenResponseObj) + "\n\nLet us save the token now");
        var gold = null;
        this.saveToken(tokenResponseObj)
        .then(username => {
          alert('** Token saved\nNow get userdetails(2nd call)');
          this.getUserDetails(username)
          .then(userdetails => {
            gold = userdetails;
            alert('*** userdetails [NEVER NULL]: \n' + JSON.stringify(userdetails));
            //save to local storage (IS THIS USED?)
            localStorage.setItem('currentUser', JSON.stringify(userdetails));
            //guard
            self.currentUserSubject.next(userdetails);
          });
        });
        alert('**** userdetails [PLEASE]: \n' + JSON.stringify(gold));
        //
      }
    }));
  }*/

  /*login(requestBody: any):  Observable<any> {
    let self = this;
    return this.http.post<any>(this.loginUrl, requestBody.toString(), this.httpOptions)
    .pipe(map((tokenResponseObj) => {
      //alert("tokenResponseObj: " + JSON.stringify(tokenResponseObj));
      if (tokenResponseObj && tokenResponseObj['access_token']) {
        //this.updateData(tokenResponseObj);
        //alert('3. this.currentUserSubject: ' + JSON.stringify(this.currentUserSubject));

        alert("* We have logged in!\ntokenResponseObj: " + JSON.stringify(tokenResponseObj) + "\n\nLet us save the token now");
        var gold = null;
        this.saveToken(tokenResponseObj)
        .then(username => {
          alert('** Token saved\nNow get userdetails(2nd call)');
          this.getUserByUsername(username).subscribe(userdetails => {
            alert('*** userdetails [NEVER NULL]: \n' + JSON.stringify(userdetails));
            //save to local storage (IS THIS USED?)
            localStorage.setItem('currentUser', JSON.stringify(userdetails));
            //guard
            self.currentUserSubject.next(userdetails);
          });
        });
        alert('**** userdetails [PLEASE]: \n' + JSON.stringify(gold));
        //
      }
    }));
  }*/

  //trying mergemap here
  /*_login(requestBody: any){
    this.http.post<any>(this.loginUrl, requestBody.toString(), this.httpOptions)
    .pipe(
      map( tokenResponseObj => {
        if (tokenResponseObj && tokenResponseObj['access_token']) {
          alert("* We have logged in!\ntokenResponseObj: " + JSON.stringify(tokenResponseObj) + "\n\nLet us save the token now");
          let token = tokenResponseObj['access_token'];
          const token_parts = token.split(/\./);
          const token_decoded = JSON.parse(window.atob(token_parts[1]));
          this.token_expires = new Date(token_decoded.exp * 1000);
          this.email = token_decoded.email;//Missing - not needed for now

          this.username = token_decoded.user_name;
          
          localStorage.setItem(AUTH_TOKEN, token);
          localStorage.setItem('email', token_decoded.email);
          localStorage.setItem('token_expiry', String(new Date(token_decoded.exp * 1000)));
        }
        alert('** Token saved\nNow get userdetails(2nd call) for:\n' + this.username);
        return this.username;
      }),
      mergeMap( username => this.http.get<any>(`${this.userUrl}/username/${username}`)),
      take(1)
    ).subscribe( userdetails => {
       alert('*** userdetails [NEVER NULL]: \n' + JSON.stringify(userdetails));
       //save to local storage (IS THIS USED?)
       localStorage.setItem('currentUser', JSON.stringify(userdetails));
       //guard
       this.currentUserSubject.next(userdetails);
       alert('KUDOS IF THE DASHBOARD HAS NOT LOADED YET BY NOW.\nIT SHOULD LOAD NEXT');
    });
  }*/

  //trying mergemap here
  login(requestBody: any){
    this.http.post<any>(this.loginUrl, requestBody.toString(), this.httpOptions)
    .pipe(
      map( tokenResponseObj => {
        if (tokenResponseObj && tokenResponseObj['access_token']) {
          //alert("* We have logged in!\ntokenResponseObj: " + JSON.stringify(tokenResponseObj) + "\n\nLet us save the token now");

          let token = tokenResponseObj['access_token'];
          const token_parts = token.split(/\./);
          const token_decoded = JSON.parse(window.atob(token_parts[1]));
          this.token_expires = new Date(token_decoded.exp * 1000);
          this.email = token_decoded.email;//Missing - not needed for now
          this.username = token_decoded.user_name;// now saving the username in userDetailsObj
          this.rolesArr = token_decoded.authorities;
          //alert('rolesArr:\n' + this.rolesArr);

          this.userObj.email = "";
          this.userObj.username = token_decoded.user_name;
          this.userObj.roles = token_decoded.authorities;

          localStorage.setItem(AUTH_TOKEN, token);
          localStorage.setItem('email', token_decoded.email);// to remove
          localStorage.setItem('token_expiry', String(new Date(token_decoded.exp * 1000)));

          //save to local storage
          localStorage.setItem('currentUser', JSON.stringify(this.userObj));
          //guard
          this.currentUserSubject.next(this.userObj);
          
        }
        //alert('** Token saved\nNow get userdetails(2nd call) for:\n' + this.username);
        return this.username; // now saving the username in userDetailsObj - Update it.
      }),
      mergeMap( username => this.http.get<any>(`${this.userUrl}/username/${username}`)),
      take(1)
    ).subscribe( userdetails => {
       //alert('*** userdetails [NEVER NULL]: \n' + JSON.stringify(userdetails));
       this.userObj.firstName = userdetails.result.firstName;
       this.userObj.lastName = userdetails.result.lastName;
       //save to local storage
       localStorage.setItem('currentUser', JSON.stringify(this.userObj));
       //guard
       this.currentUserSubject.next(this.userObj);
       
       //alert('UPDATED userObj:\n' + JSON.stringify(this.userObj));
       //alert('UPDATED currentUserSubject:\n' + JSON.stringify(this.currentUserSubject));
    });
  }

  public getUserDisplayName() {
    let displayName = this.currentUserValue.username;
    if ((this.currentUserValue.firstName) && (this.currentUserValue.lastName)) {
      displayName = this.currentUserValue.firstName + ' ' + this.currentUserValue.lastName;
    }
    return displayName;
  }

  /*testing(x) {
    alert('THIS ALERT MUST DISPLAY BEFORE DASHBOARD LOADS!');
    //save to local storage (IS THIS USED?)
    localStorage.setItem('currentUser', JSON.stringify(x));
    //guard
    this.currentUserSubject.next(x);
  }*/

  test(){
    return 'test - currentUserSubject: ' + JSON.stringify(this.currentUserSubject);
  }

  private saveToken(tokenResponseObj) : Promise<any> {

    return new Promise((resolve, reject) => {
      let token = tokenResponseObj.access_token;
      const token_parts = token.split(/\./);
      const token_decoded = JSON.parse(window.atob(token_parts[1]));
      this.token_expires = new Date(token_decoded.exp * 1000);
      this.email = token_decoded.email;//Missing - not needed for now
      this.username = token_decoded.user_name;
      
      localStorage.setItem(AUTH_TOKEN, token);
      localStorage.setItem('email', token_decoded.email);
      localStorage.setItem('token_expiry', String(new Date(token_decoded.exp * 1000)));

      resolve(this.username);

    });
    /*   
    this.getUserDetails(this.username)
    .then(value => {
      self.email = value;
      alert('ALERRRRRT [NEVER NULL]: \n' + JSON.stringify(this.email));
    });
    alert('ALERRRRRT: [NOT NULL]\n' + JSON.stringify(this.email));
    */
  }

  private getUserDetails(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getUserByUsername(user).subscribe(success => {
        resolve(success);
      });
    });
  }

  public setUserDetails(username): void {
    this.http.get<any>(`${this.userUrl}/username/${username}`)
      .pipe(map((userdetails) => {
        alert('*** userdetails [NEVER NULL]: \n' + JSON.stringify(userdetails));
        //save to local storage (IS THIS USED?)
        localStorage.setItem('currentUser', JSON.stringify(userdetails));
        //guard
        this.currentUserSubject.next(userdetails);
        //return true;
      }));
  }

  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.tokenExpired = true;
    alert('current token:' + this.getToken() + ' has expired. \n REFRESHING IT.');
    //alert('is token expired?: ' + this.isTokenExpired());
    this.http.post(this.tokenRefreshUrl, JSON.stringify({token: this.getToken()}), this.httpOptions).subscribe(
      userData => {
        alert('Token finally refreshed');
        this.updateData(userData);
        this.tokenExpired = false;
      }/*,
      err => {
        this.error = err['error'];
      }*/
    );
  }
 
  public logout() {
    //
    //alert('ABOUT TO LOG OUT - this.currentUserSubject: \n ' + JSON.stringify(this.currentUserSubject));
    //
    // this.token = null;
    this.token_expires = null; // to be removed eventually
    this.email = null;
    this.username = null;

    //guard
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // clear local storage (Not really important anymore after guard)
    localStorage.clear();
    //this.success = 'Successfully logged out';
    //alert ('Successfully logged out');
  }
 
  /*public updateData(userData) {
    // this.token = token;
    let token = userData.token;
    this.error = [];
 
    // decode the token to read the email and expiration timestamp
    //const token_parts = this.token.split(/\./);
    const token_parts = token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.email = token_decoded.email;

    //save to local storage
    //guard
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.currentUserSubject.next(userData);

    //May have to decomission the below since they're now saved in currentUser
    localStorage.setItem(AUTH_TOKEN, token);
    localStorage.setItem('email', token_decoded.email);
    localStorage.setItem('token_expiry', String(new Date(token_decoded.exp * 1000)));
  } v0 */

  public updateData(userData) {
    // this.token = token;
    let token = userData.access_token;
    this.error = [];
 
    // decode the token to read the email and expiration timestamp
    //const token_parts = this.token.split(/\./);
    const token_parts = token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.email = token_decoded.email;//Missing - not needed for now
    this.username = token_decoded.user_name;

    ////////////
    //alert("token_decoded: " + JSON.stringify(token_decoded));
    //alert("token_decoded - email : " + this.email);
    //alert("token_decoded - username : " + this.username);
    ////////////

    //May have to decomission the below since they're now saved in currentUser
    localStorage.setItem(AUTH_TOKEN, token);
    localStorage.setItem('email', token_decoded.email);
    localStorage.setItem('token_expiry', String(new Date(token_decoded.exp * 1000)));

    //new-v0
    //var currentUserObj = this.getUserByUsername(this.username);
    //alert('currentUserObj: ' + JSON.stringify(currentUserObj));
    this.getUserByUsername(this.username).subscribe(
      userDetails => {
        //alert('@@@@@@@@@@@@@@@@\n' + JSON.stringify(response));
        alert('userDetails: \n' + JSON.stringify(userDetails))
        localStorage.setItem('currentUser', JSON.stringify(userDetails));
        this.currentUserSubject.next(userDetails);
        alert('1. this.currentUserSubject: ' + JSON.stringify(this.currentUserSubject));
      },
      err => {
        this.error = err['error'];
      }
    );
    alert('2. this.currentUserSubject: ' + JSON.stringify(this.currentUserSubject));
    //
    
    //save to local storage
    //guard
    //localStorage.setItem('currentUser', JSON.stringify(userData));
    //this.currentUserSubject.next(userData);
  }

  public getLoggedInDetails(): string { // TEST
    return localStorage.getItem('email') + '. Token expires at:' + localStorage.getItem('token_expiry');
  }

  public getToken(): string {
    //return localStorage.getItem('token');
    return localStorage.getItem(AUTH_TOKEN);
  }

  private getTokenExpirationDate(token: string): Date { // Kinda duplicate
    const decoded = jwt_decode(token);

    if (decoded['exp'] === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded['exp']);
    return date;
  }

  public isTokenExpired(token?: string): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting 
    // whether or not the token is expired
    // alert('Has token expired? : ' + this.isTokenExpired(token));
    return !this.isTokenExpired(token);
  }

  create(newuser: any): Observable<boolean> {
    return this.http.post<any>(`${this.createUrl}/`, newuser)
      .pipe(map((res) => {
        if (res) {
          return res;
        } else {
          return false;
        }
      }));
  }

  getUser(employeeId): Observable<any> { //NOTE THAT THIS IS THE EMPLOYEE ID and NOT USER ID. 
    return this.http.get<any>(`${this.getUrl}/${employeeId}`)
      .pipe(map((res) => {
        return res;
      }));
  }
  
  getUserByUsername(username): Observable<any> {
    //alert('Trace - getUserByUsername');
    return this.http.get<any>(`${this.userUrl}/username/${username}`)
      .pipe(map((res) => {
        //alert('res: ' + JSON.stringify(res));
        return res;
      }));
  }

  updateUser(user: any): Observable<boolean> {
    return this.http.put<any>(`${this.updateUrl}/${user.employee}`, user) //NOTE THAT THIS IS THE EMPLOYEE ID and NOT USER ID. 
      .pipe(map((res) => {
        if (res) {
          return true;
        } else {
          return false;
        }
      })/*,
      catchError(this.handleError)*/);
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete(`${this.deleteUrl}/${id}`)
      .pipe(map(res => {
        if (res) {
          return true;
        } else {
          return false;
        }
      }));
  }

  userExists(id: number): Observable<Boolean> {
    return this.http.get(`${this.existsUrl}/${id}`)
      .pipe(map(res => {
        //alert('res: ' + JSON.stringify(res));
        return res['response'];
      }));
  }
 
}