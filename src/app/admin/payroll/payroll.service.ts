import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Payroll } from './payroll';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  baseUrl = 'http://localhost:8000/api';
  payrollUrl = this.baseUrl + '/payroll';
  payrollManageUrl = this.baseUrl + '/payroll/manage';
  payrolls: Payroll[];
  payroll: Payroll; // Added this one

  constructor(private http: HttpClient) { }

  getAllPayrolls(): Observable<Payroll[]> {

    return this.http.get<Payroll[]>(`${this.payrollUrl}/`).pipe(
      map((res) => {
        this.payrolls = res;
        return this.payrolls;
    }));
  }

  getPayroll(id): Observable<Payroll> {
    return this.http.get<Payroll>(`${this.payrollUrl}/${id}`)
      .pipe(map((res) => {
        this.payroll = res;
        return this.payroll;
      }));
  }

  storePayroll(payroll: any): Observable<any[]> {
    return this.http.post<any>(`${this.payrollManageUrl}/`, payroll)
      .pipe(map((res) => {
        if (this.payrolls) {
          this.payrolls.push(res);
        }
        return this.payrolls;
      }));
  }

  /*storePayroll(payroll: Payroll): Observable<Payroll[]> {
    return this.http.post<Payroll>(`${this.payrollManageUrl}/`, payroll)
      .pipe(map((res) => {
        if (this.payrolls) {
          this.payrolls.push(res);
        }
        return this.payrolls;
      }));
  }*/

  updatePayroll(payroll: Payroll): Observable<Payroll[]> {
    return this.http.put<Payroll>(`${this.payrollManageUrl}/${payroll.id}`, payroll)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        const thePayroll = this.payrolls.find((item) => {
          return +item.id === +payroll.id;
        });
        return this.payrolls;
      }));
  }

  deletePayroll(id: number): Observable<Payroll[]> {
    return this.http.delete(`${this.payrollManageUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        const filteredPayrolls = this.payrolls.filter((payroll) => {
          return payroll.id !== +id;
        });
        return this.payrolls = filteredPayrolls;
      }));
  }
}
