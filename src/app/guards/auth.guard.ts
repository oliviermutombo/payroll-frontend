import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from '../services/user.service'; //Authentication Service

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    /*canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.userService.currentUserValue;
        if (currentUser) {
            for (let role of route.data.roles) {
                if (currentUser.role.indexOf(role) > -1){
                    return true;
                    break;// not needed anymore
                }
            }
            // role not authorised so redirect to home page
            this.router.navigate(['/']);
            return false;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    } // v0*/

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.userService.currentUserValue;
        if (currentUser) {
            for (let role of route.data.roles) {
                alert ('currentUser.roles[\'name\']: ' + currentUser.roles['name']);
                /*if (currentUser.roles['name'].indexOf(role) > -1){
                    return true;
                    break;// not needed anymore
                }*/
            }
            // role not authorised so redirect to home page
            this.router.navigate(['/']);
            return false;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    arraysEqual(_arr1, _arr2) {

        if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
          return false;
    
        var arr1 = _arr1.concat().sort();
        var arr2 = _arr2.concat().sort();
    
        for (var i = 0; i < arr1.length; i++) {
    
            if (arr1[i] !== arr2[i])
                return false;
    
        }
    
        return true;
    
    }

    isEquivalent(a, b) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
    
        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }
    
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
    
            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
    
        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
}