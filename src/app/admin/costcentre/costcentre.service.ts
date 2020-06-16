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
export class CostcentreService {}
