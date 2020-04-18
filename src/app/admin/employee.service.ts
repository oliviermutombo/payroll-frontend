import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Employee } from './employee/employee';
import { Salary } from './salary/salary';

import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = environment.apiUrl;
  salaryUrl = this.baseUrl + '/salary';
  salaryManageUrl = this.baseUrl + '/salary/manage';
  employeeUrl = this.baseUrl + '/employee';
  employeePartialUrl = this.baseUrl + '/employee/partial';
  employees: Employee[];
  employee: Employee;
  salaries: Salary[];
  salary: Salary; // Added this one

  constructor(private http: HttpClient) { }

  /*private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.status == 404) {
      return throwError('Not found!');
    }
    else {
      //alert('FOR DEBUGGING PURPOSE ONLY\n' + JSON.stringify(error));
      return throwError('Error! something went wrong.\n FOR DEBUGGING PURPOSE ONLY\n' + JSON.stringify(error));
    }
  }*/
  // <EMPLOYEE>

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.employeeUrl}/`).pipe(
      map((res) => {
        this.employees = res;
        return this.employees;
    })/*,
    catchError(this.handleError)*/);
  }

  getEmployee(id): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`)
      .pipe(map((res) => {
        this.employee = res;
        return this.employee;
      })/*,
      catchError(this.handleError)*/);
  }

  store(employee: Employee): Observable<boolean> {
    return this.http.post<Employee>(`${this.employeeUrl}/`, employee)
      .pipe(map((res) => {
        // RETURN SUCCESS MESSAGE?
        if (res) {
          return true;
        } else {
          return false;
        }
      })/*,
      catchError(this.handleError)*/);
  }

  update(employee: Employee): Observable<boolean> {
    return this.http.put<Employee>(`${this.employeeUrl}/${employee.id}`, employee)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        // RETURN SUCCESS MESSAGE HERE?
        if (res) {
          return true;
        } else {
          return false;
        }
      })/*,
      catchError(this.handleError)*/);
  }

  updatePartial(employee: Employee): Observable<boolean> {
    return this.http.put<Employee>(`${this.employeePartialUrl}/${employee.id}`, employee)
      .pipe(map((res) => {
        if (res) {
          return true;
        } else {
          return false;
        }
      }));
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete(`${this.employeeUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        // RETURN SUCCESS MESSAGE?
        // alert('update - res:' + JSON.stringify(res));
        if (res) {
          return true;
        } else {
          return false;
        }
      })/*,
      catchError(this.handleError)*/);
  }

  // <SALARY>
  getAllSalaries(): Observable<Salary[]> {

    return this.http.get<Salary[]>(`${this.salaryUrl}/`).pipe(
      map((res) => {
        this.salaries = res;
        return this.salaries;
    })/*,
    catchError(this.handleError)*/);
  }

  getSalary(id): Observable<Salary> {
    return this.http.get<Salary>(`${this.salaryUrl}/${id}`)
      .pipe(map((res) => {
        this.salary = res;
        return this.salary;
      })/*,
      catchError(this.handleError)*/);
  }

  storeSalary(salary: Salary): Observable<Salary[]> {
    return this.http.post<Salary>(`${this.salaryManageUrl}/`, salary)
      .pipe(map((res) => {
        if (this.salaries) {
          // Above Condition added to make the list available on demand. can't populate list if not requested (or it throws an error)
          this.salaries.push(res);
        }
        return this.salaries;
      })/*,
      catchError(this.handleError)*/);
  }

  updateSalary(salary: Salary): Observable<Salary[]> {
    return this.http.put<Salary>(`${this.salaryManageUrl}/${salary.id}`, salary)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        const theSalary = this.salaries.find((item) => {
          return +item.id === +salary.id;
        });
        if (theSalary) {
          theSalary.paygrade = salary.paygrade;
          theSalary.basicpay = +salary.basicpay;
        }
        return this.salaries;
      })/*,
      catchError(this.handleError)*/);
  }

  deleteSalary(id: number): Observable<Salary[]> {
    return this.http.delete(`${this.salaryManageUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        const filteredSalaries = this.salaries.filter((salary) => {
          return salary.id !== +id;
        });
        return this.salaries = filteredSalaries;
      })/*,
      catchError(this.handleError)*/);
  }
}
