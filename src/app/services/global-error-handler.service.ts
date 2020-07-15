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
        //alert('### GLOBAL ###\n' + JSON.stringify(error));
        console.log('### GLOBAL ###\n' + JSON.stringify(error));
        if (error.status === 0) {
            if (error.statusText) {
                if (error.statusText === 'Unknown Error') {
                    notifier.showError('Server not reachable.');
                }
            }
        } 
        else if (error.status >= 400 && error.status < 500 ) {
            //alert('2.2\n' + JSON.stringify(error));
            if (((error.error.error) && (error.error.message === "No message available")) || (error.error.message === "")) {
                //alert('2.2.2');
                notifier.showError(error.error.error);
                console.error('An error occurred:', error.error.error);
            } else if (error.error.message) {
                //alert('2.2.1');
                notifier.showError(error.error.message);
                console.error('An error occurred:', error.error.message);
            } else if ((error.error.error) || (error.error.message === "No message available")) {
                //alert('2.2.2');
                notifier.showError(error.error.error);
                console.error('An error occurred:', error.error.error);
            } else {
                //alert('2.2.3');
                notifier.showError('An error occurred!');
                console.error('An error occurred!');
            }
            
        } else if (error.status === 500) {
            //alert('2.3');
            let statusText = error.statusText;
            if (error.error){
                if (error.error['message']){
                    notifier.showError(error.error['message']);
                }
                if (error.error.startsWith("IntegrityError")){
                    notifier.showError(statusText + ' - Check if this record already exists or contact system administrator.' );
                }
            } else {
                notifier.showError('FOR DEBUGGING PURPOSES ONLY - 500\n' + statusText + ' - ' + JSON.stringify(error));
            }
        } else {
            alert('2.4');
            notifier.showError('FOR DEBUGGING PURPOSES ONLY - ' + JSON.stringify(error.error));
        }
        
        //Backend returns unsuccessful response codes such as 404, 500 etc.				  
        console.error('Backend returned status code: ', error.status);
        console.error('Response body:', error.message);          	  
      } else {
            if (error.status>=900){
                console.error(error.message);
                notifier.showError(error.message);
            } else {
                //notifier.showError('An error occurred!');
                notifier.showError('FOR DEBUGGING PURPOSES ONLY - ' + error.message);
                console.error(error.message);
            }
                      
      }
      //alert('Navigating to error page now');
      //router.navigate(['/error']);
    }
} 