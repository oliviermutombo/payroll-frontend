import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from './country';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class CountryService {

    baseUrl = environment.baseUrl;
    countryUrl = this.baseUrl + '/countries';
    countries: Country[];
    country: Country;

    constructor(private http: HttpClient) { }
  
    getAllCountries(): Observable<Country[]> {
  
      return this.http.get<Country[]>(`${this.countryUrl}/`).pipe(
        map((res) => {
          this.countries = res;
          return this.countries;
      }));
    }
  
    getCountry(id): Observable<Country> {
      return this.http.get<Country>(`${this.countryUrl}/${id}`)
        .pipe(map((res) => {
          this.country = res;
          return this.country;
        }));
    }
  
    storeCountry(country: Country): Observable<Country[]> {
      return this.http.post<Country>(`${this.countryUrl}/`, country)
        .pipe(map((res) => {
          if (this.countries) {
            // Above Condition added to make the list available on demand. can't populate list if not requested (or it throws an error)
            this.countries.push(res);
          }
          return this.countries;
        }));
    }
  
    updateCountry(country: Country): Observable<Country[]> {
      return this.http.patch<Country>(`${this.countryUrl}/${country.id}`, country)
      // The below stuff are just to update the views if they're displayed at the same time. double check if really needed.
        .pipe(map((res) => {
          const theCountry = this.countries.find((item) => {
            return +item.id === +country.id;
          });
          return this.countries;
        }));
    }
  
    deleteCountry(id: number): Observable<Country[]> {
      return this.http.delete(`${this.countryUrl}/${id}`)
        .pipe(map(res => {
          const filteredCountries = this.countries.filter((country) => {
            return country.id !== +id;
          });
          return this.countries = filteredCountries;
        }));
    }
}