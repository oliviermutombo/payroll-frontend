import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Position } from './position';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  baseUrl = 'http://localhost:8000/api';
  // baseUrl = 'http://localhost:51480/api'; // debungging
  positionUrl = this.baseUrl + '/position';
  positionManageUrl = this.baseUrl + '/position/manage';
  positions: Position[];
  position: Position; // Added this one

  constructor(private http: HttpClient) { }

  /*private handleError(error: HttpErrorResponse) {
    console.log(error);
    alert('FOR DEBUGGING PURPOSE ONLY\n' + JSON.stringify(error));

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }*/

  getAllPositions(): Observable<Position[]> { // REMOVE METHOD AS IT HAS BEEN MOVED TO DATA SERVICE INSTEAD

    return this.http.get<Position[]>(`${this.positionUrl}/`).pipe(
      map((res) => {
        this.positions = res;
        return this.positions;
    }));
  }

  getPosition(id): Observable<Position> {
    return this.http.get<Position>(`${this.positionUrl}/${id}`)
      .pipe(map((res) => {
        this.position = res;
        return this.position;
      }));
  }

  storePosition(position: Position): Observable<Position[]> {
    return this.http.post<Position>(`${this.positionManageUrl}/`, position)
      .pipe(map((res) => {
        if (this.positions) {
          // Above Condition added to make the list available on demand. can't populate list if not requested (or it throws an error)
          this.positions.push(res);
        }
        return this.positions;
      }));
  }

  updatePosition(position: Position): Observable<Position[]> {
    return this.http.put<Position>(`${this.positionManageUrl}/${position.id}`, position)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map((res) => {
        const thePosition = this.positions.find((item) => {
          return +item.id === +position.id;
        });
        if (thePosition) {
          thePosition.name = position.name;
        }
        return this.positions;
      }));
  }

  deletePosition(id: number): Observable<Position[]> {
    return this.http.delete(`${this.positionManageUrl}/${id}`)
    // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
      .pipe(map(res => {
        const filteredPositions = this.positions.filter((position) => {
          return position.id !== +id;
        });
        return this.positions = filteredPositions;
      }));
  }
}
