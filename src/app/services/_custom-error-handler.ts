import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  public error: any

  constructor(private injector: Injector) { }

  handleError(error) {
    const router = this.injector.get(Router);
    /*if (error.rejection.status === 401 || error.rejection.status === 403) {
      router.navigate(['/login']);
    }*/
    if (error.status === 401) {
      this.error = '# Your sessions has expired!';
      //this.userService.logout(); // important to .bind(this) when calling handleError to use service context.
    } else if(error.status === 405) {
      this.error = '# Sorry, you are not allowed to perform this operation. (' + error.status + ')';
    }else {
      this.error = '# FOR DEBUGGING PURPOSES ONLY\n' + JSON.stringify(error.error); //FOR DEBUGGING PURPOSES ONLY
    }
    
    throw error;
  }
}