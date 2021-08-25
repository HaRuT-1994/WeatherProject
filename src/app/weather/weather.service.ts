import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  city$: Observable<string>;
  cityName = '';

  constructor( private store: Store<{ city: string}>, private http: HttpClient ){
    this.city$ = store.select('city');
  }

  getInfo(): Observable<any> {
    this.city$.subscribe(data => this.cityName = data);
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${environment.openWeatherAPIKey}`);
  }
}
