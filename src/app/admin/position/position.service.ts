//NO LONGER USED BUT DOUBLE CHECK BEFORE DELETING
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Position } from './position';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {}
