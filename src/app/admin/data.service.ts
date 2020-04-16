import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//////////////////////////////////////////////// open
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Costcentre } from './costcentre/costcentre';
import { Department } from './department/department';
import { Position } from './position/position';
import { PayrollPeriod } from './payrollPeriod/payrollPeriod';
import { Deduction } from './deduction/deduction';
//////////////////////////////////////////////// close

@Injectable({
    providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  baseUrl = 'http://localhost:8000/api';

  costcentreUrl = this.baseUrl + '/costcentre';
  costcentre: Costcentre;
  costcentres: Costcentre[];

  departmentUrl = this.baseUrl + '/department';
  department: Department;
  departments: Department[];

  positionUrl = this.baseUrl + '/position';
  position: Position;
  positions: Position[];

  payrollPeriodUrl = this.baseUrl + '/payrollPeriod';
  payrollPeriod: PayrollPeriod;
  payrollPeriods: PayrollPeriod[];

  deductionUrl = this.baseUrl + '/deduction';
  deduction: Deduction;
  deductions: Deduction[];

  constructor(private http: HttpClient) { }//

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  getAllCostcentres(): Observable<Costcentre[]> {

    return this.http.get<Costcentre[]>(`${this.costcentreUrl}/`).pipe(
      map((res) => {
        this.costcentres = res;
        return this.costcentres;
    }));
  }

  getAllDepartments(): Observable<Department[]> {

    return this.http.get<Department[]>(`${this.departmentUrl}/`).pipe(
      map((res) => {
        this.departments = res;
        return this.departments;
    }));
  }

  getAllPositions(): Observable<Position[]> {

    return this.http.get<Position[]>(`${this.positionUrl}/`).pipe(
      map((res) => {
        // alert('Positions serv: ' + JSON.stringify(res));
        this.positions = res;
        return this.positions;
    }));
  }

  getAllPayrollPeriods(): Observable<PayrollPeriod[]> {

    return this.http.get<PayrollPeriod[]>(`${this.payrollPeriodUrl}/`).pipe(
      map((res) => {
        this.payrollPeriods = res;
        return this.payrollPeriods;
    }));
  }

  getAllDeductions(): Observable<Deduction[]> { // REMOVE METHOD AS IT HAS BEEN MOVED TO DATA SERVICE INSTEAD

    return this.http.get<Deduction[]>(`${this.deductionUrl}/`).pipe(
      map((res) => {
        this.deductions = res;
        return this.deductions;
    }));
  }

}
