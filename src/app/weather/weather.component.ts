import { Component, OnDestroy, OnInit} from '@angular/core';
import {last, tap} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { cityName } from './store/weather.actions';
import { WeatherService } from './weather.service';
import {AsyncSubject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";

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
    this.subscription = this.http.get<any>(`http://api.openweathermap.org/geo/1.0/reverse?lat=${this.weatherInfo.coords[0]}&lon=${this.weatherInfo.coords[1]}&limit=1&appid=5c30d4c53e1c367f3d8d30550651d1d1`)
      .subscribe(data => {
        this.weatherInfo.city = data[0].name;
        this.onChangeLocation();
      })
  }

  onChangeLocation() {
    this.store.dispatch(cityName({city: this.weatherInfo.city}));
    this.weatherService.getInfo().pipe(
      tap( data => {
        console.log(data);
        // this.weatherInfo.city = data.name,
        // this.weatherInfo.desc = data.weather[0].description,
        // this.weatherInfo.coords = [data.coord.lat, data.coord.lon]

        this.weatherInfo = {
          city: data.name, desc: data.weather[0].description, temp: (Math.round(data.main.temp) - 273),
          coords: [data.coord.lat, data.coord.lon]
        }
      })
    ).subscribe(() => this.weatherInfo);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
