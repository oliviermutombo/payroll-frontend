import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as globals from 'src/app/globals';
import { ApiService } from 'src/app/admin/api.service';
import { Company } from '../admin/company/company';


@Injectable({
    providedIn: 'root'
  })
  export class UtilitiesService {

    constructor(private apiService: ApiService) {}

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

    setCurrencySymbol(force?:Boolean): void {
        if (!localStorage.getItem('currencySymbol') || force==true) {
            this.apiService.getAll(globals.COMPANY_ENDPOINT).subscribe(
                (res: Company[]) => {
                    if (res.length > 0) {
                        let company = res[0];
                        if (company) {
                            if (company.address) {
                                if (company.address.country) {
                                    if (company.address.country.symbol) localStorage.setItem('currencySymbol', company.address.country.symbol);
                                }
                            }
                        }
                    }
                }
            );
        }
    }

    getCurrencySymbol(): string {
        if (localStorage.getItem('currencySymbol')) {
            return localStorage.getItem('currencySymbol');
        } else return 'R';//ZAR is default currency
    }
  }