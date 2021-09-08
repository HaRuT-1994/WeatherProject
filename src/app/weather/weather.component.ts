import { Component, OnInit} from '@angular/core';
import {  tap, filter} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { coordsAction } from './store/actions/coords.actions';
import { cityAction } from './store/actions/city.actions';
import { WeatherService } from './weather.service';
import { HttpClient } from "@angular/common/http";
import { WeatherState } from './store/reducers/city.reducers';
import { WeekWeatherState } from './store/reducers/coords.reducer';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})

export class WeatherComponent implements OnInit {
  weather: any;
  cityName = '';
  info$: any;
  coords: number[] = [];

  constructor(private store: Store<WeatherState>, private mystore: Store<WeekWeatherState>, private weatherService: WeatherService, private http: HttpClient) {  }

  ngOnInit() {
    this.info$ =
    this.store.pipe(select('city'),
    filter(state => state !== null),
    tap(data => {this.coords = Object.values(data['coord']).reverse()})
    );
  }

  onChangeLocation() {
    this.store.dispatch(cityAction({request: this.cityName}));
    setTimeout(() => {this.store.dispatch(coordsAction({request: this.coords}));}, 400)

  }

  onMaplatlng(event) {
    event = Object.values(event);
    this.store.dispatch(coordsAction({request: event}))
    this.weatherService.reverseGeocoding(event).subscribe(
      data => this.store.dispatch(cityAction({request: data[0].name}))
    )
  }
}
