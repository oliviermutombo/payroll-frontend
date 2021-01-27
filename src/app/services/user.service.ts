import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
//import * as jwt_decode from 'jwt-decode';
import { Observable, BehaviorSubject, Subject, ReplaySubject, from, of } from 'rxjs';
import { map, mergeMap, take, switchMap } from 'rxjs/operators';
import { environment } from './../../environments/environment';

//guard

import { User } from '../user/user'

export const AUTH_TOKEN: string = 'jwt_token';
export const REFRESH_TOKEN: string = 'refresh_token';
 
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
 
  constructor(private http: HttpClient) {

    var apiUsername = environment.apiUsername;
    var apiPassword = environment.apiPassword;

    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                      'Authorization': 'Basic ' + btoa(apiUsername + ':' + apiPassword),
                      observe:'response'
                })
    };
  }

  /*public refreshToken() {
    this.tokenExpired = true;
    console.log('refreshToken()');
    this.http.post(this.loginUrl, this.httpOptions).subscribe(
      tokenResponseObj => {
        console.log('refreshToken() - refreshed');
        this.setUserData(tokenResponseObj);
        this.tokenExpired = false;
      });
  }*/

  /*public getUserDisplayName() {
    let displayName = this.currentUserValue.username;
    if ((this.currentUserValue.firstName) && (this.currentUserValue.lastName)) {
      displayName = this.currentUserValue.firstName + ' ' + this.currentUserValue.lastName;
    }
    return displayName;
  }*/
  
  /*CHECK IF THIS GETS USED - CHECK DATE: 2021-01-27 (feedback: Logic moved to AUTH)
  public getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN);
  }
  public refreshToken() {
    this.tokenExpired = true;
    console.log('refreshToken()');
    return this.http.post(this.loginUrl, this.httpOptions).pipe(switchMap((tokenResponseObj) => {
      let data = from(this.setUserData(tokenResponseObj));
      return data.pipe(switchMap(() => {
          return of(tokenResponseObj);
      }))
    }));
  }*/

  /*private getTokenExpirationDate(token: string): Date { // Kinda duplicate
    const decoded = jwt_decode(token);

    if (decoded['exp'] === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded['exp']);
    return date;
  }*/

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

  updatePassword(inputObj: any): Observable<boolean> {//TO-BE-COMPLETED.
    return this.http.post<any>(`${this.userUrl}/password`, inputObj)
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
}