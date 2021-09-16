import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { cityAction } from './store/actions/city.actions';
import { CurrentWeather } from './shared/CurrentWeather.interface';
import { WeekWeather } from './shared/WeekWeather.interface';
import { coordsAction } from './store/actions/coords.actions';

@Injectable()
export class WeatherService {
  city$: Observable<any>;
  coords: number[] = [40.177200, 44.503490];

  constructor(
    private store: Store<{city: string}>,
    private http: HttpClient,
    private zone: NgZone
    ) {
      this.getGeolocation();
      this.zone.runOutsideAngular(()=>{
         setTimeout(()=>{
          this.reverseGeocoding(this.coords).subscribe(
            data => {
              this.store.dispatch(cityAction({request: data[0].name}));
              this.store.dispatch(coordsAction({request: this.coords}));
            })
         }, 0);
      })
  }

  getGeolocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.coords = [];
          this.coords.push(position.coords.latitude, position.coords.longitude);
          this.store.dispatch(coordsAction({request: this.coords}));
        },
        err => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        })
    } else {
      console.log('Geolocation not available');
    }
  }

  reverseGeocoding(coord) {
    const params = new HttpParams()
    .set('lat', coord[0])
    .set('lon', coord[1])
    .set('limit', '1')
    .set('appid', environment.openWeatherAPIKey);

    return this.http.get<any>(`https://api.openweathermap.org/geo/1.0/reverse`, {params});
  }

  getInfoByCity(city): Observable<any>{
    const params = new HttpParams()
    .set('q', city)
    .set('units', 'metric')
    .set('exclude', 'current,daily,minutely,alerts')
    .set('appid', environment.openWeatherAPIKey);

    return this.http.get<Observable<CurrentWeather>>(`https://api.openweathermap.org/data/2.5/weather?`, {params});
  }

  getAllInfo(coords): Observable<any>{
    const params = new HttpParams()
    .set('lat', coords[0])
    .set('lon', coords[1])
    .set('units', 'metric')
    .set('exclude', 'minutely,alerts')
    .set('appid', environment.openWeatherAPIKey);

    return this.http.get<Observable<WeekWeather>>(`https://api.openweathermap.org/data/2.5/onecall?`, {params});
  }
}

