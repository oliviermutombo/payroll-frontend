import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Department } from './department';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  baseUrl = environment.apiUrl;
  departmentUrl = this.baseUrl + '/department';
  departmentManageUrl = this.baseUrl + '/department/manage';
  departments: Department[];
  department: Department; // Added this one

  constructor(private http: HttpClient) { }

  /*private handleError(error: HttpErrorResponse) {
    console.log(error);
    alert('FOR DEBUGGING PURPOSE ONLY\n' + JSON.stringify(error));

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }*/

  getAllDepartments(): Observable<Department[]> { // REMOVE METHOD AS IT HAS BEEN MOVED TO DATA SERVICE INSTEAD

    return this.http.get<Department[]>(`${this.departmentUrl}/`).pipe(
      map((res) => {
        this.departments = res;
        return this.departments;
    }));
  }

  getDepartment(id): Observable<Department> {
    return this.http.get<Department>(`${this.departmentUrl}/${id}`)
      .pipe(map((res) => {
        this.department = res;
        return this.department;
      }));
  }

  storeDepartment(department: Department): Observable<Department[]> {
    return this.http.post<Department>(`${this.departmentManageUrl}/`, department)
      .pipe(map((res) => {
        if (this.departments) {
          // Above Condition added to make the list available on demand. can't populate list if not requested (or it throws an error)
          this.departments.push(res);
        }
        return this.departments;
      }));
  }

  updateDepartment(department: Department): Observable<Department[]> {
    return this.http.put<Department>(`${this.departmentManageUrl}/${department.id}`, department)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        const theDepartment = this.departments.find((item) => {
          return +item.id === +department.id;
        });
        /*
        Decomissioned because the parameter only has the FK ID and not the FK object.
        if (theDepartment) {
          theDepartment.name = department.name;
          theDepartment.costcentre = department.costcentre;
          theDepartment.hod = +department.hod;
        }*/
        return this.departments;
      }));
  }

  deleteDepartment(id: number): Observable<Department[]> {
    return this.http.delete(`${this.departmentManageUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        const filteredDepartments = this.departments.filter((department) => {
          return department.id !== +id;
        });
        return this.departments = filteredDepartments;
      }));
  }
}
