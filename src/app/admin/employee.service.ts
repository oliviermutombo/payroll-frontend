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
export class EmployeeService {/*

  baseUrl = environment.baseUrl;
  salaryUrl = this.baseUrl + '/salaries';
  
  employeeUrl = this.baseUrl + '/employees';
  //employeePartialUrl = this.baseUrl + '/employee/partial';
  employees: Employee[];
  employee: Employee;
  salaries: Salary[];
  salary: Salary; // Added this one

  constructor(private http: HttpClient) { }

  // <EMPLOYEE>

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.employeeUrl}/`).pipe(
      map((res) => {
        this.employees = res;
        return this.employees;
    }));
  }

  getEmployee(id): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`)
      .pipe(map((res) => {
        this.employee = res;
        return this.employee;
      }));
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
      }));
  }

  update(employee: Employee): Observable<boolean> {
    return this.http.patch<Employee>(`${this.employeeUrl}/${employee.id}`, employee)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        // RETURN SUCCESS MESSAGE HERE?
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
      }));
  }

  // <SALARY>
  getAllSalaries(): Observable<Salary[]> {

    return this.http.get<Salary[]>(`${this.salaryUrl}/`).pipe(
      map((res) => {
        this.salaries = res;
        return this.salaries;
    }));
  }

  getSalary(id): Observable<Salary> {
    return this.http.get<Salary>(`${this.salaryUrl}/${id}`)
      .pipe(map((res) => {
        this.salary = res;
        return this.salary;
      }));
  }

  storeSalary(salary: Salary): Observable<Salary[]> {
    return this.http.post<Salary>(`${this.salaryUrl}/`, salary)
      .pipe(map((res) => {
        if (this.salaries) {
          // Above Condition added to make the list available on demand. can't populate list if not requested (or it throws an error)
          this.salaries.push(res);
        }
        return this.salaries;
      }));
  }

  updateSalary(salary: Salary): Observable<Salary[]> {
    return this.http.patch<Salary>(`${this.salaryUrl}/${salary.id}`, salary)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        const theSalary = this.salaries.find((item) => {
          return +item.id === +salary.id;
        });
        if (theSalary) {
          theSalary.payGrade = salary.payGrade;
          theSalary.basicPay = +salary.basicPay;
        }
        return this.salaries;
      }));
  }

  deleteSalary(id: number): Observable<Salary[]> {
    return this.http.delete(`${this.salaryUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        const filteredSalaries = this.salaries.filter((salary) => {
          return salary.id !== +id;
        });
        return this.salaries = filteredSalaries;
      }));
  }
*/}
