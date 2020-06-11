import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Company } from './company';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

    baseUrl = environment.baseUrl;
    companyUrl = this.baseUrl + '/companies';  
    companies: Company[];
    company: Company; // Added this one

    constructor(private http: HttpClient) { }

    getAllCompanies(): Observable<Company[]> { // REMOVE METHOD AS IT HAS BEEN MOVED TO DATA SERVICE INSTEAD

        return this.http.get<Company[]>(`${this.companyUrl}/`).pipe(
        map((res) => {
            this.companies = res;
            return this.companies;
        }));
    }

    getCompany(id): Observable<Company> {
        return this.http.get<Company>(`${this.companyUrl}/${id}`)
        .pipe(map((res) => {
            this.company = res;
            return this.company;
        }));
    }

    storeCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(`${this.companyUrl}/`, company)
        .pipe(map((res) => {
            return res;
        }));
    }

    updateCompany(company: Company): Observable<Company> {
        return this.http.patch<Company>(`${this.companyUrl}/${company.id}`, company)
        // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
        .pipe(map((res) => {
            return res;
        }));
    }

    deleteCompany(id: number): Observable<Company[]> {
        return this.http.delete(`${this.companyUrl}/${id}`)
        // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
        .pipe(map(res => {
            const filteredCompanies = this.companies.filter((company) => {
            return company.id !== +id;
            });
            return this.companies = filteredCompanies;
        }));
    }
}