import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
  })
  export class UtilitiesService {

    public Encrypt(input) {
        if (input) {
            input = 'P'+input+'=';
            return btoa(input);
        } else return null
    }

    public Decrypt(input) {
        if (input) {
            let decrypted = atob(input)
            decrypted = decrypted.substr(1).slice(0, -1);
            return decrypted;
        } else return null
    }

    public splitString(input) : any {
        if (input) {
            return input.split(" ");
        } else return null;
    }

  }