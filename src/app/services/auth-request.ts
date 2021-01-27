import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

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