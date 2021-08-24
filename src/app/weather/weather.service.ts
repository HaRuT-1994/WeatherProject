import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=5c30d4c53e1c367f3d8d30550651d1d1`);
  }
}
