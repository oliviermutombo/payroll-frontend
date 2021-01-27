import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { NotificationService } from './notification.service';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService, private injector: Injector,  private notification: NotificationService,) { }

  notifier = this.injector.get(NotificationService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.auth.getJwtToken()) {
      request = this.addToken(request, this.auth.getJwtToken());
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if ((error.error.error==='invalid_token') && (error.error.error_description.startsWith("Invalid refresh token"))) {
          this.auth.logout();
          //this.notifier.showError("Your session expired");
          //let cutomError={status: 900, message:"Your session expired!"};
          return throwError({status: 900, message:"Your session expired!"});
        } else return this.handle401Error(request, next, error);
      } else {
        return throwError(error);
      }
    }));
  }

  /*private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }*/
  private addToken(request: HttpRequest<any>, token: string) {
    if (request.url.includes('oauth')) {
      return request;
    } else {
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  }

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, error) {//added 3rd param (error)
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access_token);
          return next.handle(this.addToken(request, token.access_token));
        })
      );

    } else {
      //custom - no longer needed
      /*if (!this.auth.getJwtToken()) {// If false means user is not logged in. we may wanna display appropriate error
        if (error.error.error == "invalid_token"){
          error.error.error_description = "Error signing you in!";
        }
        return throwError(error);
      }*/
      //
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
}