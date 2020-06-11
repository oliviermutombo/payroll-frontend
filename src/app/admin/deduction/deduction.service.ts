import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Deduction } from './deduction';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeductionService {

  baseUrl = environment.apiUrl;
  deductionUrl = this.baseUrl + '/deduction';
  employeedeductionUrl = this.deductionUrl + '/emp';
  deductionManageUrl = this.baseUrl + '/deduction/manage';
  deductions: Deduction[];
  deduction: Deduction; // Added this one

  constructor(private http: HttpClient) { }

  getAllDeductions(): Observable<Deduction[]> { // REMOVE METHOD AS IT HAS BEEN MOVED TO DATA SERVICE INSTEAD

    return this.http.get<Deduction[]>(`${this.deductionUrl}/`).pipe(
      map((res) => {
        this.deductions = res;
        return this.deductions;
    }));
  }

  getDeduction(id): Observable<Deduction> {
    return this.http.get<Deduction>(`${this.deductionUrl}/${id}`)
      .pipe(map((res) => {
        this.deduction = res;
        return this.deduction;
      }));
  }

  getEmployeeDeduction(employeeid): Observable<Deduction> {
    return this.http.get<Deduction>(`${this.employeedeductionUrl}/${employeeid}`)
      .pipe(map((res) => {
        //this.deduction = res;
        //return this.deduction;
        return res;
      }));
  }

  storeDeduction(deduction: Deduction): Observable<Deduction[]> {
    return this.http.post<Deduction>(`${this.deductionManageUrl}/`, deduction)
      .pipe(map((res) => {
        if (this.deductions) {
          // Above Condition added to make the list available on demand. can't populate list if not requested (or it throws an error)
          this.deductions.push(res);
        }
        return this.deductions;
      }));
  }

  updateDeduction(deduction: Deduction): Observable<Deduction[]> {
    return this.http.put<Deduction>(`${this.deductionManageUrl}/${deduction.id}`, deduction)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        const theDeduction = this.deductions.find((item) => {
          return +item.id === +deduction.id;
        });
        if (theDeduction) {
          theDeduction.tax = deduction.tax;
          theDeduction.medicalaid = deduction.medicalaid;
          theDeduction.retirement = deduction.retirement;
        }
        return this.deductions;
      }));
  }

  deleteDeduction(id: number): Observable<Deduction[]> {
    return this.http.delete(`${this.deductionManageUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        const filteredDeductions = this.deductions.filter((deduction) => {
          return deduction.id !== +id;
        });
        return this.deductions = filteredDeductions;
      }));
  }
}
