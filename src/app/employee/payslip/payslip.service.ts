import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class PayslipService {

    baseUrl = environment.apiUrl;
    payslipUrl = this.baseUrl + '/payslip';

    payslip = {};

    constructor(private http: HttpClient) { }

    getPayslip(id): Observable<any> {
        return this.http.get<any>(`${this.payslipUrl}/${id}`)
          .pipe(map((res) => {
            //alert(JSON.stringify(res));
            this.payslip = res;
            return this.payslip;
          }));
    }

  }