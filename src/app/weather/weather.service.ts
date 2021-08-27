import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {AsyncSubject, Observable} from 'rxjs';
import { environment } from "../../environments/environment";
import {skip, switchMap} from "rxjs/operators";
import {coord} from "./store/weather.actions";

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
          this.store.dispatch(coord({coords: [position.coords.latitude, position.coords.longitude] }))
        })
    } else {
      console.log('Geolocation not available');
    }
  }

  getInfo(): Observable<any> {
    this.city$.subscribe(data => this.cityName = data);
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${environment.openWeatherAPIKey}`);
  }

  // getHoursTemp() {
  //   return this.store.select('coords')
  //     .pipe(
  //       switchMap(
  //         (coords): Observable<any> => {
  //           const params = new HttpParams()
  //             .set('lat', coords[0])
  //             .set('lon', coords[1])
  //             .set('limit', '1')
  //             .set('appid', environment.openWeatherAPIKey);
  //
  //           return this.http.get('https://api.openweathermap.org/data/2.5/onecall?', {params});
  //         }
  //       )
  //     )
  // }
}
