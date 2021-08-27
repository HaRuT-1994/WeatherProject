import { Component, OnDestroy, OnInit} from '@angular/core';
import {last, delay, tap, skip, switchMap} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { cityName, coord } from './store/weather.actions';
import { WeatherService } from './weather.service';
import {AsyncSubject, Observable, Subscription} from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})

export class WeatherComponent implements OnInit, OnDestroy {
  public weatherInfo = {
    city: '', desc: '', temp: 0,
    coords: [0, 0]
  };
  private locationSubscription!: Subscription;

  constructor(private store: Store<{ coords: number[] }>, private weatherService: WeatherService, private http: HttpClient) {  }

  ngOnInit() {
    this.weatherService.getGeolocation();
    this.store.select('coords')
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
      )
      .subscribe(
        getCity => {
          this.weatherInfo.city = getCity[0].name;
          this.onChangeLocation();
        }
      );
  }

  onChangeLocation() {
    this.store.dispatch(cityName({city: this.weatherInfo.city}));
    this.locationSubscription = this.weatherService.getInfo().pipe(
      tap( data => {
        this.weatherInfo = {
          city: data.name, desc: data.weather[0].description, temp: (Math.round(data.main.temp) - 273),
          coords: [data.coord.lat, data.coord.lon]
        };
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.locationSubscription.unsubscribe();
  }
}
