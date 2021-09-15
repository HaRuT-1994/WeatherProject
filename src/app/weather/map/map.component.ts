import {Input, Component, OnInit, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import {Store, select} from '@ngrx/store';
import {filter, tap} from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { WeekWeatherState } from '../store/reducers/coords.reducer'
import { coordsSelector } from '../store/selectors/coords.selector';

declare const L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() coords = [0, 0];
  @Input() data = null;
  marker: any;
  myMap: any;
  @Output() maplatlng = new EventEmitter<any>();
  private subscription: Subscription;
  private mapInit = false;
  private popupContent : string;

  constructor(private store: Store<WeekWeatherState>) {}

  ngOnInit() {
    this.createMap();
    this.subscription = this.store.pipe(select(coordsSelector),
    filter(data => data !== null),
    tap( data => {
      this.coords = [data['lat'], data['lon']];
      return this.coords;
    })
    ).subscribe(
      () => {
        this.myMap?.flyTo(this.coords, 8);
        this.marker?.setLatLng(this.coords);

        L.popup({offset: [5, -25]})
        .setLatLng(this.coords)
        .setContent(this.popupContent)
        .openOn(this.myMap);
      }
    )

    this.mapInit = true;
  }

  createMap() {
    this.myMap = L.map('mapid').setView(this.coords, 3);
    this.marker = L.marker(this.coords).addTo(this.myMap);
    this.myMap?.flyTo(this.coords, 8)

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGFydXQxOTk0IiwiYSI6ImNrc2syZTg2NzBpdnYyenFvbXowNTgwbmoifQ.WkisctBEhm5SjXPKkdW33g', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(this.myMap);

    L.DomEvent.on(this.myMap, 'click', (ev) => {
      this.maplatlng.emit(ev.latlng);
  });

  L.popup({offset: [5, -25]})
    .setLatLng(this.coords)
    .setContent(this.popupContent)
    .openOn(this.myMap);
  }

  ngOnChanges() {
    this.coords = Object.values(this.coords).reverse();
    this.myMap?.flyTo(this.coords, 8);
    this.marker?.setLatLng(this.coords);

    if(this.mapInit) {
      L.popup({offset: [0, -25]})
      .setLatLng(this.coords)
      .setContent(this.popupContent)
      .openOn(this.myMap);
    }

    this.popupContent = `<p>Min temp ${this.data["main"]["temp_min"]}<sup>0</sup> /
    Max temp ${this.data["main"]["temp_max"]}<sup>0</sup></p><div class ="info-block"><div>${this.data["weather"][0]["main"]} - </div> <div>
    <img src="http://openweathermap.org/img/wn/${this.data["weather"][0]["icon"]}.png"/></div></div>`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
