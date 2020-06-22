import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
  })
  export class UtilitiesService {

    generateQuickIdObject(value){
        if (this.isObject(value)) return value
        if (value == null) return null
        return {'id': value}
    }

    isObject(obj) {
        return obj === Object(obj);
    }

    addToArray(arr, x){
        if (arr==undefined) arr = [];
        arr.push(x);
        return arr;
    }

    allPropertiesNull(obj) {
        for (var key in obj) {
            if (obj[key] !== null && obj[key] != "")
                return false;
        }
        return true;
    }
    
    getUpdateObject(orig, current) {//Move to a util class
        var changes = {};

        for (var prop in orig) {
            if (prop.indexOf("$") != 0 && orig[prop] !== current[prop]) {
                changes[prop] = current[prop];
            }
        }
        return changes ;
    };
    
    /*private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();
    changeMessage(message: string) {
        this.messageSource.next(message);
    }*/

    private cryptKey = 1234567890;

    public Encrypt(input) {
        if (input) {
            if (+input) {
                input *= this.cryptKey;
            }
            input = 'P'+input+'=';
            return btoa(input);
        } else return null
    }

    public Decrypt(input) {
        if (input) {
            let decrypted: any = atob(input);
            decrypted = decrypted.substr(1).slice(0, -1);
            if (+decrypted) {
                decrypted /= this.cryptKey;
            }
            return decrypted;
        } else return null
    }

  }