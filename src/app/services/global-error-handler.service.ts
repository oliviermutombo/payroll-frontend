import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { NotificationService } from '../services/notification.service'; // new
import { UserService } from '../services/user.service'; // new

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

    constructor(private injector: Injector, private userService: UserService) { }    

    handleError(error: any) {
        const notifier = this.injector.get(NotificationService); // new
        let router = this.injector.get(Router);
        console.log('URL: ' + router.url);
      
      if (error instanceof HttpErrorResponse) {
        //alert(JSON.stringify(error));
        if (error.status === 0) {
            if (error.statusText) {
                if (error.statusText === 'Unknown Error') {
                    notifier.showError('Server not reachable.');
                }
            }
        } 
        else if (error.status === 404) {
            if(!this.userService.isAuthenticated()) { //If token is not valid or password changed. log user out first.
                this.userService.logout();
            }
            notifier.showError('Not found!'); // 404 won't always be for invalid credentials. make it generic
        } else if (error.status === 401) {
            if (error.error){
                if (error.error.detail == "Signature has expired.") {
                    alert('signature expired. refresh it.');
                    this.userService.logout(); // Log out for now!!!
                    //this.userService.refreshToken();
                } else {
                    //this.userService.logout(); // page may be on a resource that is restricted(401). do not log out here
                    //notifier.showError('Your session expired');
                    notifier.showError('FOR DEBUGGING PURPOSES ONLY\r\n' + JSON.stringify(error.error));
                }
            } else if (error.statusText) {
                notifier.showError(error.statusText);
            }
        } else if (error.status === 403) {
            notifier.showError('You are not authorised to perform this operation.'); // update thi. (maybe a token refresh is needed)
        } else if (error.status === 500) {
            let statusText = error.statusText;
            if (error.error){
                if (error.error.startsWith("IntegrityError")){
                    notifier.showError(statusText + ' - Check if this record already exists or contact system administrator.' );
                }
            } else {
                notifier.showError('FOR DEBUGGING PURPOSES ONLY - ' + statusText + ' - ' + JSON.stringify(error.error));
            }
        } else {
            notifier.showError('FOR DEBUGGING PURPOSES ONLY - ' + JSON.stringify(error.error));
        }
        
        //Backend returns unsuccessful response codes such as 404, 500 etc.				  
        console.error('Backend returned status code: ', error.status);
        console.error('Response body:', error.message);          	  
      } else {
            //alert('we\'re finally here!');
            //alert(error);
            //alert(JSON.stringify(error.message));
            notifier.showError(error.message);       
            console.error('An error occurred:', error.message);          
      }
      //alert('Navigating to error page now');
      //router.navigate(['/error']);
    }
} 