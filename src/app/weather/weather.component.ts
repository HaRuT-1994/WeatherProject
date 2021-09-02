import { Component, OnDestroy, OnInit} from '@angular/core';
import {last, delay, map, take, switchMap, takeUntil} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { cityName, coordsAction } from './store/weather.actions';
import { WeatherService } from './weather.service';
import {AsyncSubject, Observable, Subscription, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CoordsModel } from './shared/coords.interface';
// import { AppState } from './store/app-state.model';

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
  private locationSubscription: Subscription;


  constructor(private store: Store, private weatherService: WeatherService, private http: HttpClient) {  }

  ngOnInit() {
    setTimeout(() => {
      this.weatherInfo.city = this.weatherService.cityName;
      this.onChangeLocation();
    }, 1000);
  }

  onChangeLocation() {
    this.store.dispatch(cityName({city: this.weatherInfo.city}));
    this.locationSubscription = this.weatherService.getInfo().pipe(
      map( data => {
        return {
          city: data.name, desc: data.weather[0].description, temp: data.main.temp,
          coords: [data.coord.lat, data.coord.lon]
        };
      })
    ).subscribe(
      (data) => {
        console.log(1111111)
        this.store.dispatch(coordsAction());
        this.weatherInfo = data;
      }
    );
  }

  ngOnDestroy() {
    this.locationSubscription.unsubscribe();
  }

  onMaplatlng(event) {
    console.log(this.weatherInfo.coords)
    this.store.dispatch(coordsAction())
  }
}
