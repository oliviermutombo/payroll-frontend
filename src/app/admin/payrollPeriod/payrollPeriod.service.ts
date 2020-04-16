import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PayrollPeriod } from './payrollPeriod';

@Injectable({
  providedIn: 'root'
})
export class PayrollPeriodService {

  baseUrl = 'http://localhost:8000/api';
  // baseUrl = 'http://localhost:51480/api'; // debungging
  payrollPeriodUrl = this.baseUrl + '/payrollPeriod';
  payrollPeriodManageUrl = this.baseUrl + '/payrollPeriod/manage';
  payrollPeriods: PayrollPeriod[];
  payrollPeriod: PayrollPeriod; // Added this one

  constructor(private http: HttpClient) { }

  /*private handleError(error: HttpErrorResponse) {
    console.log(error);
    alert('FOR DEBUGGING PURPOSE ONLY\n' + JSON.stringify(error));

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }*/

  getAllPayrollPeriods(): Observable<PayrollPeriod[]> { // REMOVE METHOD AS IT HAS BEEN MOVED TO DATA SERVICE INSTEAD

    return this.http.get<PayrollPeriod[]>(`${this.payrollPeriodUrl}/`).pipe(
      map((res) => {
        this.payrollPeriods = res;
        return this.payrollPeriods;
    }));
  }

  getPayrollPeriod(id): Observable<PayrollPeriod> {
    return this.http.get<PayrollPeriod>(`${this.payrollPeriodUrl}/${id}`)
      .pipe(map((res) => {
        this.payrollPeriod = res;
        return this.payrollPeriod;
      }));
  }

  storePayrollPeriod(payrollPeriod: PayrollPeriod): Observable<PayrollPeriod[]> {
    return this.http.post<PayrollPeriod>(`${this.payrollPeriodManageUrl}/`, payrollPeriod)
      .pipe(map((res) => {
        if (this.payrollPeriods) {
          // Above Condition added to make the list available on demand. can't populate list if not requested (or it throws an error)
          this.payrollPeriods.push(res);
        }
        return this.payrollPeriods;
      }));
  }

  updatePayrollPeriod(payrollPeriod: PayrollPeriod): Observable<PayrollPeriod[]> {
    return this.http.put<PayrollPeriod>(`${this.payrollPeriodManageUrl}/${payrollPeriod.id}`, payrollPeriod)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        const thePayrollPeriod = this.payrollPeriods.find((item) => {
          return +item.id === +payrollPeriod.id;
        });
        if (thePayrollPeriod) {
          thePayrollPeriod.period = payrollPeriod.period;
        }
        return this.payrollPeriods;
      }));
  }

  deletePayrollPeriod(id: number): Observable<PayrollPeriod[]> {
    return this.http.delete(`${this.payrollPeriodManageUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        const filteredPayrollPeriods = this.payrollPeriods.filter((payrollPeriod) => {
          return payrollPeriod.id !== +id;
        });
        return this.payrollPeriods = filteredPayrollPeriods;
      }));
  }
}
