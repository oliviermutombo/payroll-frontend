import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, mapTo, tap, map, mergeMap, take } from 'rxjs/operators';
import { Tokens } from './tokens';
import { environment } from './../../environments/environment';//OM
//guard
import { User } from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  private baseUrl = environment.apiUrl;//OM
  private apiVersion = environment.apiVersion;//OM
  private authUrl = this.baseUrl + '/oauth/token';//OM
  private userUrl = this.baseUrl + this.apiVersion + '/users';//OM
  private httpOptions: any;//OM
  public userObj = new User();//OM
  public currentUserSubject: BehaviorSubject<User>;//OM-guard
  public currentUser: Observable<User>;//OM

  constructor(private http: HttpClient) {
    
    //OM
    var apiUsername = environment.apiUsername;
    var apiPassword = environment.apiPassword;
    this.httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(apiUsername + ':' + apiPassword),
                        observe:'response'
                })
    };
    //guard
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  //OM - USER RELATED
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
  public getUserDisplayName() {
    let displayName = this.currentUserValue.username;
    if ((this.currentUserValue.firstName) && (this.currentUserValue.lastName)) {
      displayName = this.currentUserValue.firstName + ' ' + this.currentUserValue.lastName;
    }
    return displayName;
  }

  //guard
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  //

  login(requestBody: any){
    this.http.post<any>(this.authUrl, requestBody.toString(), this.httpOptions)
    .pipe(
      map( tokens => {
        return this.doLoginUser(requestBody['username'], tokens);
      }),
      mergeMap( username => this.http.get<any>(`${this.userUrl}/username/${username}`)),
      take(1)
    ).subscribe( userdetails => {
      this.updateUderData(userdetails);
    });
  }

  private updateUderData(userData): void {//OM
    this.userObj.firstName = userData.result.firstName;
    this.userObj.lastName = userData.result.lastName;
    localStorage.setItem('currentUser', JSON.stringify(this.userObj));////////////////////////
    this.currentUserSubject.next(this.userObj);
  }

  public logout() {//UPDATE TO ALLOW SERVER LOGOUT
    this.userObj = new User();//Do not set to null - rather empty object

    //guard
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    this.doLogoutUser();//STO

    // clear local storage (Not really important anymore after guard)
    localStorage.clear();
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken(){
    let requestBody = new URLSearchParams();
        requestBody.set('grant_type', 'refresh_token');
        requestBody.set('refresh_token', this.getRefreshToken());

    return this.http.post<any>(this.authUrl, requestBody.toString(), this.httpOptions)
    .pipe(tap((tokens: any) => {
      //this.storeJwtToken(tokens['access_token']);
      this.storeTokens(tokens);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }
  private doLoginUser(username: string, tokens: any) {
    this.loggedUser = username;
    this.storeTokens(tokens);
    return this.setUserData(tokens);
  }
  
  private setUserData(tokensObj): string {//OM

    if (tokensObj && tokensObj['access_token']) {

      let token = tokensObj['access_token'];
      const token_parts = token.split(/\./);
      const token_decoded = JSON.parse(window.atob(token_parts[1]));
      this.userObj.username = token_decoded.user_name;
      this.userObj.roles = token_decoded.authorities;
      //save to local storage
      localStorage.setItem('currentUser', JSON.stringify(this.userObj));
      //guard
      this.currentUserSubject.next(this.userObj);     
    }
    return this.userObj.username;
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
