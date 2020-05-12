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

  baseUrl = environment.apiUrl;
  apiVersion = environment.apiVersion;

  //loginUrl = this.baseUrl + '/obtain-token/'; //v0
  loginUrl = this.baseUrl + '/oauth/token';
  userUrl = this.baseUrl + this.apiVersion + '/users';
  existsUrl = this.userUrl + '/exists';


  tokenRefreshUrl = this.baseUrl + '/api-token-refresh/';
  //createUrl = this.baseUrl + '/create-user';
  //getUrl = this.baseUrl + '/get-user';
  //updateUrl = this.baseUrl + '/update-user';
  //deleteUrl = this.baseUrl + '/delete-user';
 
  // http options used for making API calls
  private httpOptions: any;
 
  // the actual JWT token
  // public token: string;
 
  // the token expiration date
  public token_expires: Date;

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
  }

  public hasRole(_role) {
    let userdetails = this.currentUser.source['_value'];
    let rolesArr = null;
    if (userdetails) {
      rolesArr = this.currentUser.source['_value'].roles;
    }
    
    if (rolesArr) {
      if (rolesArr.indexOf(_role) > -1){
        return true;
      }
    }
    return false;
  }

  //guard
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(requestBody: any){
    this.http.post<any>(this.loginUrl, requestBody.toString(), this.httpOptions)
    .pipe(
      map( tokenResponseObj => {
        return this.setUserData(tokenResponseObj);
      }),
      mergeMap( username => this.http.get<any>(`${this.userUrl}/username/${username}`)),
      take(1)
    ).subscribe( userdetails => {
      this.updateUderData(userdetails);
    });
  }

  private setUserData(userData): string {

    if (userData && userData['access_token']) {

      let token = userData['access_token'];
      const token_parts = token.split(/\./);
      const token_decoded = JSON.parse(window.atob(token_parts[1]));
      this.token_expires = new Date(token_decoded.exp * 1000);
      
      this.userObj.username = token_decoded.user_name;
      this.userObj.roles = token_decoded.authorities;

      localStorage.setItem(AUTH_TOKEN, token);
      localStorage.setItem('token_expiry', String(new Date(token_decoded.exp * 1000)));

      //save to local storage
      localStorage.setItem('currentUser', JSON.stringify(this.userObj));
      //guard
      this.currentUserSubject.next(this.userObj);
      
    }
    return this.userObj.username; // now saving the username in userDetailsObj - Update it.
  }

  private updateUderData(userData): void {
    this.userObj.firstName = userData.result.firstName;
    this.userObj.lastName = userData.result.lastName;
    //save to local storage
    localStorage.setItem('currentUser', JSON.stringify(this.userObj));
    //guard
    this.currentUserSubject.next(this.userObj);
  }

  public getUserDisplayName() {
    let displayName = this.currentUserValue.username;
    if ((this.currentUserValue.firstName) && (this.currentUserValue.lastName)) {
      displayName = this.currentUserValue.firstName + ' ' + this.currentUserValue.lastName;
    }
    return displayName;
  }

  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.tokenExpired = true;
    alert('current token:' + this.getToken() + ' has expired. \n REFRESHING IT.');
    //alert('is token expired?: ' + this.isTokenExpired());
    this.http.post(this.tokenRefreshUrl, JSON.stringify({token: this.getToken()}), this.httpOptions).subscribe(
      userData => {
        alert('Token finally refreshed');
        this.setUserData(userData);
        this.tokenExpired = false;
      }/*,
      err => {
        this.error = err['error'];
      }*/
    );
  }
 
  public logout() {
    this.token_expires = null; // to be removed eventually
    this.userObj = new User();//Do not set to null - rather empty object

    //guard
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // clear local storage (Not really important anymore after guard)
    localStorage.clear();
  }

  public getLoggedInDetails(): string { // TEST (To be removed - only tested in costcentre)
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
    const token = this.getToken();
    return !this.isTokenExpired(token);
  }

  create(newuser: any): Observable<boolean> {
    return this.http.post<any>(`${this.userUrl}/`, newuser)
      .pipe(map((res) => {
        if (res) {
          return res;
        } else {
          return false;
        }
      }));
  }

  /*getUser(employeeId): Observable<any> { //NOTE THAT THIS IS THE EMPLOYEE ID and NOT USER ID. 
    return this.http.get<any>(`${this.getUrl}/${employeeId}`)
      .pipe(map((res) => {
        return res;
      }));
  } v0*/

  getUser(id): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/${id}`)
      .pipe(map((res) => {
        return res;
      }));
  }
  
  getUserByUsername(username): Observable<any> { // Currently not used
    //alert('Trace - getUserByUsername');
    return this.http.get<any>(`${this.userUrl}/username/${username}`)
      .pipe(map((res) => {
        //alert('res: ' + JSON.stringify(res));
        return res;
      }));
  }

  /*updateUser(user: any): Observable<boolean> {
    return this.http.put<any>(`${this.userUrl}/${user.employee}`, user) //NOTE THAT THIS IS THE EMPLOYEE ID and NOT USER ID. 
      .pipe(map((res) => {
        if (res) {
          return true;
        } else {
          return false;
        }
      })/*,
      catchError(this.handleError)star-here/);
  }*/

  updateUser(user: any): Observable<boolean> {//TO-BE-COMPLETED.
    return this.http.patch<any>(`${this.userUrl}`, user)
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
    return this.http.delete(`${this.userUrl}/${id}`)
      .pipe(map(res => {
        if (res) {
          return true;
        } else {
          return false;
        }
      }));
  }

  userExists(employee: any): Observable<Boolean> {//Currently not used - no need for it anymore since employee now returns this info.
    return this.http.post(`${this.existsUrl}`, employee)
      .pipe(map(res => {
        return res['result'];
      }));
  }
 
}