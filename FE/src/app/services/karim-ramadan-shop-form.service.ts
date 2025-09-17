import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class KarimRamadanShopFormService {
  private baseUrlCountries="http://localhost:8080/api/countries";
  private baseUrlStates="http://localhost:8080/api/states";

  constructor(private http:HttpClient) {
  }
  getMonthsForCreditCard(startMonth:number): Observable<number[]> {
    let months: number[] = [];
    for(let i=startMonth;i<=12;i++){
      months.push(i);
    }
    return of(months);
  }

  getYearsForCreditCard():Observable<number[]> {
    const years: number[] = [];
    const startYear:number = new Date().getFullYear();
    const endYear:number = startYear+10;
    for(let i=startYear;i<=endYear;i++){
      years.push(i);
    }
    return of(years);
  }
  getCountries():Observable<Country[]>{
    return this.http.get<GetResponseCountry>(this.baseUrlCountries).pipe(
      map(res => res._embedded.countries)
    );
  }
  getStatesByCountryCode(countryCode:string):Observable<State[]>{
    return this.http.get<GetResponseState>(`${this.baseUrlStates}/search/findByCountryCode?code=${countryCode}`).pipe(
      map(state => state._embedded.states)
    )
  }
}

interface GetResponseCountry{
  _embedded:{
    countries:Country[]
  }
}
interface GetResponseState{
  _embedded:{
    states:State[]
  }
}