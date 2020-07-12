import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ApiService {

    baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Returns Observable<any[]>
     * @param entityEndpoint 
     */
    getAll(entityEndpoint: string): Observable<any[]> {

        return this.http.get<any[]>(`${this.baseUrl + entityEndpoint}/`).pipe(
            map((res) => {
                return res;
        }));
    }

    /**
     * Returns Observable<any>
     * @param entityEndpoint 
     * @param id 
     */
    getById(entityEndpoint: string, id): Observable<any> {
        return this.http.get<any>(`${this.baseUrl + entityEndpoint}/${id}`)
            .pipe(map((res) => {
                return res;
        }));
    }

    /**
     * Returns Observable<any>
     * @param entityEndpoint
     */
    getSelf(entityEndpoint: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl + entityEndpoint + '/self'}`)
            .pipe(map((res) => {
                return res;
        }));
    }

    /**
     * Returns Observable<boolean> - True for updated; False for not updated.
     * @param entityEndpoint 
     * @param entityObject 
     */
    updatePersonalDetails(entityEndpoint: string, entityObject: any): Observable<Boolean> {
        return this.http.patch<any>(`${this.baseUrl + entityEndpoint + '/self'}`, entityObject)
        .pipe(map((res) => {
            if (res) {
                return true;
              } else {
                return false;
              }
        }));
    }

    /**
     * Returns Observable<any[]>
     * For performance purposes when implementing this, make sure the result is cached
     * and returned on future requests.
     * @param entityEndpoint 
     * @param entityObject
     * @param allArr - Optional(if not set, a bool is returned) .array list of all objects - used to update views
     */
    save(entityEndpoint: string, entityObject: any, allArr: any[]): Observable<any[]> {
        return this.http.post<any>(`${this.baseUrl + entityEndpoint}/`, entityObject)
          .pipe(map((res) => {
            if (allArr) {
                allArr.push(res);
            }
            return allArr;
        }));
    }

    /**
     * Returns Observable<boolean> - True for saved; False for not saved.
     * @param entityEndpoint 
     * @param entityObject 
     */
    saveOnly(entityEndpoint: string, entityObject: any): Observable<boolean> {
        return this.http.post<any>(`${this.baseUrl + entityEndpoint}/`, entityObject)
          .pipe(map((res) => {
            if (res) {
                return true;
            } else {
                return false;
            }
        }));
    }

    /**
     * Returns Observable<any[]>
     * Make sure to update cache as well
     * @param entityEndpoint 
     * @param entityObject 
     * @param allArr array list of all objects since one is updated. can be null - used to update views
     */
    update(entityEndpoint: string, entityObject: any, allArr: any[]): Observable<any[]> {
        return this.http.patch<any>(`${this.baseUrl + entityEndpoint}/${entityObject.id}`, entityObject)
        .pipe(map((res) => {
            /*const updatedObj = allArr.find((item) => {
                return +item.id === +entityObject.id;
            });
            alert('updatedObj\n' + JSON.stringify(updatedObj));
            return allArr;*/
            const index: number = allArr.findIndex(x => x.id === entityObject.id);
            if (index !== -1) {
                allArr.splice(index, 1);
            }
            //allArr.push(res);
            allArr.push(entityObject);
            return allArr;
        }));
    }

    /**
     * Returns Observable<boolean> - True for updated; False for not updated.
     * @param entityEndpoint 
     * @param entityObject 
     */
    updateOnly(entityEndpoint: string, entityObject: any): Observable<Boolean> {
        return this.http.patch<any>(`${this.baseUrl + entityEndpoint}/${entityObject.id}`, entityObject)
        .pipe(map((res) => {
            if (res) {
                return true;
              } else {
                return false;
              }
        }));
    }

    /**
     * Returns Observable<any[]>
     * Make sure to update cache as well with deleted item.
     * @param entityEndpoint 
     * @param id 
     * @param allArr 
     */
    delete(entityEndpoint: string, id: number, allArr: any[]): Observable<any[]> {
        return this.http.delete(`${this.baseUrl + entityEndpoint}/${id}`)
          .pipe(map(res => {
            const filteredObj = allArr.filter((item) => {
                return item.id !== +id;
            });
            return filteredObj;
        }));
    }

    /**
     * Returns Observable<boolean> - True for deleted; False for not deleted.
     * @param entityEndpoint 
     * @param id 
     */
    deleteOnly(entityEndpoint: string, id: number): Observable<boolean> {
        return this.http.delete(`${this.baseUrl + entityEndpoint}/${id}`)
          .pipe(map(res => {
            if (res) {
                return true;
            } else {
            return false;
            }
        }));
    }

}