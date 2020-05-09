import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UserService } from '../../services/user.service';
import { Costcentre } from './costcentre';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostcentreService {

  baseUrl = environment.baseUrl;
  costcentreUrl = this.baseUrl + '/costcentres';
  
  costcentres: Costcentre[];
  costcentre: Costcentre; // Added this one

  public error: any

  constructor(private http: HttpClient, private userService: UserService) {}

  public test(){
    alert('this.userService.getLoggedInDetails(): ' + this.userService.getLoggedInDetails());
  }

  /*/TO COMMENT - NOT USED
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.error = 'Your sessions has expired!';
      this.userService.logout(); // important to .bind(this) when calling handleError to use service context.
    } else if(error.status === 405) {
      this.error = 'Sorry, you are not allowed to perform this operation. (' + error.status + ')';
    }else {
      this.error = 'FOR DEBUGGING PURPOSES ONLY\n' + JSON.stringify(error.error); //FOR DEBUGGING PURPOSES ONLY
    }
    // return an observable with a user friendly message
    return throwError(this.error);//Error! something went wrong.
  }*/

  getAllCostcentres(): Observable<Costcentre[]> { // REMOVE METHOD AS IT HAS BEEN MOVED TO DATA SERVICE INSTEAD

    return this.http.get<Costcentre[]>(`${this.costcentreUrl}/`).pipe(
      map((res) => {
        this.costcentres = res;
        return this.costcentres;
    }));
  }

  getCostcentre(id): Observable<Costcentre> {
    return this.http.get<Costcentre>(`${this.costcentreUrl}/${id}`)
      .pipe(map((res) => {
        this.costcentre = res;
        return this.costcentre;
      }));
  }

  storeCostcentre(costcentre: Costcentre): Observable<Costcentre[]> {
    return this.http.post<Costcentre>(`${this.costcentreUrl}/`, costcentre)
      .pipe(map((res) => {
        if (this.costcentres) {
          // Above Condition added to make the list available on demand. can't populate list if not requested (or it throws an error)
          this.costcentres.push(res);
        }
        return this.costcentres;
      }));
  }

  updateCostcentre(costcentre: Costcentre): Observable<Costcentre[]> {
    return this.http.patch<Costcentre>(`${this.costcentreUrl}/${costcentre.id}`, costcentre)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        const theCostcentre = this.costcentres.find((item) => {
          return +item.id === +costcentre.id;
        });
        if (theCostcentre) {
          theCostcentre.name = costcentre.name;
          theCostcentre.owner = +costcentre.owner;
        }
        return this.costcentres;
      }));
  }

  deleteCostcentre(id: number): Observable<Costcentre[]> {
    return this.http.delete(`${this.costcentreUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        const filteredCostcentres = this.costcentres.filter((costcentre) => {
          return costcentre.id !== +id;
        });
        return this.costcentres = filteredCostcentres;
      }));
  }
}
