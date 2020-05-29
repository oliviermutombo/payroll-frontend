import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
  })
  export class UtilitiesService {

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
            let decrypted: any = atob(input)
            decrypted = decrypted.substr(1).slice(0, -1);
            if (+decrypted) {
                decrypted /= this.cryptKey;
            }
            return decrypted;
        } else return null
    }

  }