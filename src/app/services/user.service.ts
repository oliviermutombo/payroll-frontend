import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

//guard

import { User } from '../user/user'

export const AUTH_TOKEN: string = 'jwt_token';


 
// @Injectable()
@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  isSytemAdmin = true;

  baseUrl = 'http://localhost:8000/api';
  loginUrl = this.baseUrl + '/obtain-token/';
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
 
  // error messages received from the login attempt.
  public error: any = [];

  public success: any;

  public tokenExpired = false;

  //guard
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
 
  constructor(private http: HttpClient) {
    //guard
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    //roles
    this.isSytemAdmin = true;
    //alert('this.currentUser: ' + JSON.stringify(this.currentUser.source._value.role));
    //alert('this.currentUser: ' + JSON.stringify(this.currentUser));
  }

  public hasRole(_role) { //preferred technique because it pulls value from Observalable/BehaviorSubject
    let rolesArr = this.currentUser.source['_value'].role;
    //alert('rolesArr!: ' + JSON.stringify(rolesArr));
    if (rolesArr) {
      if (rolesArr.indexOf(_role) > -1){
        return true;
      }
    }
    return false;
  }

  //guard
  public get currentUserValue(): User {
    //alert('this.currentUserSubject.value: ' + JSON.stringify(this.currentUserSubject.value))
    return this.currentUserSubject.value;
  }

  login(user: any):  Observable<any> {
    return this.http.post<any>(this.loginUrl, JSON.stringify(user), this.httpOptions)
    .pipe(map((userData) => {
      if (userData && userData['token']) {
        this.updateData(userData);
      }
      return userData;
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
    // this.token = null;
    this.token_expires = null; // to be removed eventually
    this.email = null;

    //guard
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // clear local storage (Not really important anymore after guard)
    localStorage.clear();
    //this.success = 'Successfully logged out';
    //alert ('Successfully logged out');
  }
 
  public updateData(userData) {
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