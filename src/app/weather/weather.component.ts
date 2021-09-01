import { Component, OnDestroy, OnInit} from '@angular/core';
import {last, delay, map, take, switchMap, takeUntil} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { cityName, CoordsAction } from './store/weather.actions';
import { WeatherService } from './weather.service';
import {AsyncSubject, Observable, Subscription, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CoordsModel } from './shared/coords.model';
import { AppState } from './store/app-state.model';

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
  destroy$: Subject<void> = new Subject<void>();

coords: Observable<Array<any>>;
error$: Observable<Error>;
newCoords: any;


  constructor(private store: Store<AppState>, private weatherService: WeatherService, private http: HttpClient) {  }

  ngOnInit() {
    this.coords = this.store.select(store => store.coords.coords);
    this.error$ = this.store.select(store => store.coords.error);

    this.weatherService.reverseGeocoding()
    .subscribe(
      getCity => {
        this.weatherInfo.city = getCity[0].name;
        console.log(getCity)
        this.onChangeLocation();
      }
    );

    this.store.dispatch(new CoordsAction);
  }

  onChangeLocation() {
    this.store.dispatch(cityName({city: this.weatherInfo.city}));
    // this.locationSubscription = this.weatherService.getInfo().pipe(
    //   // takeUntil(this.destroy$),
    //   map( data => {
    //     return {
    //       city: data.name, desc: data.weather[0].description, temp: data.main.temp,
    //       coords: [data.coord.lat, data.coord.lon]
    //     };
    //   })
    // ).subscribe(
    //   (data) => {
    //     this.weatherInfo = data;
    //     // this.store.dispatch(coord({coords: [this.weatherInfo.coords[0], this.weatherInfo.coords[1]] }));
    //     // this.destroy$.unsubscribe();
    //   }
    // );
  }

  ngOnDestroy() {
    this.locationSubscription.unsubscribe();
  }

  onMaplatlng(event) {
    this.store.dispatch(new CoordsAction);
  }
}
