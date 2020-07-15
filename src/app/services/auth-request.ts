import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {UserService, AUTH_TOKEN } from './user.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

/*@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public auth: UserService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem(AUTH_TOKEN);
    if(token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${AUTH_PREFIX} ${this.auth.getToken()}`
        }
      });
    }
    return next.handle(request);
  }
} v0*/

/*@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public auth: UserService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(AUTH_TOKEN);
    if(token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${AUTH_PREFIX} ${this.auth.getAccessToken()}`
        }
      });
    }
    return next.handle(request);
  }
} v1*/

@Injectable()//NO LONGER USED. REFER TO TokenInterceptor
export class AuthInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('oauth')) {
      const token = this.auth.getJwtToken();
      if(token) {
        request = request.clone({
          setHeaders: {
            Authorization: `${AUTH_PREFIX} ${token}`
          }
        });
      }
    }
    return next.handle(request);
  }
}//v1 update