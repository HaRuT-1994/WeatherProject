import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { delay, switchMap } from "rxjs/operators";
import { CoordsModel } from './shared/coords.model';
import { CoordsAction } from './store/weather.actions';
// import { createCoordsAction } from "./store/weather.actions";

@Injectable({ providedIn: 'root' })
export class WeatherService {
  city$: Observable<any>;
  cityName = ''

   constructor(
     private store: Store<{city: string, coords: [number, number]}>,
     private http: HttpClient
   ) {
     this.city$ = this.store.select('city')
   }

  getGeolocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.store.dispatch(new CoordsAction);
        })
    } else {
      console.log('Geolocation not available');
    }
  }

  reverseGeocoding() {
    this.getGeolocation();
    return this.store.select('coords')
      .pipe(
        switchMap(
          (coords): Observable<any> => {
            const params = new HttpParams()
            .set('lat', coords[0])
            .set('lon', coords[1])
            .set('limit', '1')
            .set('appid', environment.openWeatherAPIKey);
          return this.http.get<any>(`https://api.openweathermap.org/geo/1.0/reverse`, {params})
          }
        )
      );
  }

  getInfo(): Observable<any> {
    this.city$.subscribe(data => this.cityName = data);
    return this.http.get<CoordsModel>(`https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&units=metric&exclude=current,daily,minutely,alerts&appid=${environment.openWeatherAPIKey}`).pipe(
      delay(500)
    );
  }

  getAllInfo() {
    return this.store.select('coords').pipe(
      switchMap(
        (coords): Observable<any> => {
          const params = new HttpParams()
          .set('lat', coords[0])
          .set('lon', coords[1])
          .set('units', 'metric')
          .set('exclude', 'minutely,alerts')
          .set('appid', environment.openWeatherAPIKey);

          return this.http.get(`https://api.openweathermap.org/data/2.5/onecall?`, {params});
        }
      )
    )
  }
}
