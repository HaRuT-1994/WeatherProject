import { Component, OnDestroy, OnInit} from '@angular/core';
import {last, tap} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { cityName } from './store/weather.actions';
import { WeatherService } from './weather.service';
import { AsyncSubject, Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})

export class WeatherComponent implements OnInit, OnDestroy {
  weatherInfo = {
    city: '', desc: '', temp: 0,
    coords: [40.209612799999995, 44.531712]
  };
  private _position = new AsyncSubject<number[]>();
  position$ = this._position.asObservable();
  subscription!: Subscription;

  constructor(private store: Store<{ coords: number[] }>, private weatherService: WeatherService, private http: HttpClient) {
    this.position$ = store.select('coords');
  }

  ngOnInit() {
    this.position$.pipe(last()).subscribe(data => {
      this.weatherInfo.coords = data;
    });
    this.subscription = this.http.get<any>(`http://api.openweathermap.org/geo/1.0/reverse?lat=${this.weatherInfo.coords[0]}&lon=${this.weatherInfo.coords[1]}&limit=1&appid=${environment.openWeatherAPIKey}`)
      .subscribe(data => {
        this.weatherInfo.city = data[0].name;
        this.onChangeLocation();
      })
  }

  onChangeLocation() {
    this.store.dispatch(cityName({city: this.weatherInfo.city}));
    this.weatherService.getInfo().pipe(
      tap( data => {
        this.weatherInfo = {
          city: data.name, desc: data.weather[0].description, temp: (Math.round(data.main.temp) - 273),
          coords: [data.coord.lat, data.coord.lon]
        }
      })
    ).subscribe(() => this.weatherInfo);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // ge
  }
}
