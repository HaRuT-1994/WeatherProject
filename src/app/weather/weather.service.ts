import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { map, switchMap, delay } from "rxjs/operators";
import { CoordsModel } from './shared/coords.interface';
import { cityName } from './store/weather.actions';
// import { createCoordsAction } from "./store/weather.actions";

@Injectable({ providedIn: 'root' })
export class WeatherService {
  city$: Observable<any>;
  cityName = ''
  coords: number[] = [];

  constructor(
    private store: Store<{city: string, coords: CoordsModel}>,
    private http: HttpClient) {
    this.getGeolocation();
    setTimeout(()=>{
      this.reverseGeocoding().subscribe(
        data => {
          this.cityName = data[0].name;
        })
    }, 0)
  }

  getGeolocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.coords.push(position.coords.latitude, position.coords.longitude);
        })
    } else {
      console.log('Geolocation not available');
    }
  }

  reverseGeocoding() {
    const params = new HttpParams()
    .set('lat', this.coords[0])
    .set('lon', this.coords[1])
    .set('limit', '1')
    .set('appid', environment.openWeatherAPIKey);

    return this.http.get<any>(`https://api.openweathermap.org/geo/1.0/reverse`, {params});
  }

  getInfo(): Observable<any> {
    return this.store.select('city').pipe(
      switchMap(
        (city): Observable<any> => {
          console.log(222222222)
          const params = new HttpParams()
          .set('q', city)
          .set('units', 'metric')
          .set('exclude', 'current,daily,minutely,alerts')
          .set('exclude', 'minutely,alerts')
          .set('appid', environment.openWeatherAPIKey);

          return this.http.get(`https://api.openweathermap.org/data/2.5/weather?`, {params}).pipe(delay(200));
        }
      )
    )
  }

  getAllInfo() {
    return this.store.select('coords').pipe(
      switchMap(
        (coords): Observable<any> => {
          const params = new HttpParams()
          .set('lat', coords.coord.lat)
          .set('lon', coords.coord.lon)
          .set('units', 'metric')
          .set('exclude', 'minutely,alerts')
          .set('appid', environment.openWeatherAPIKey);

          return this.http.get(`https://api.openweathermap.org/data/2.5/onecall?`, {params}).pipe(delay(300));
        }
      )
    )
  }
}
