import {Input, Component, OnInit, OnChanges} from '@angular/core';
import { Store } from '@ngrx/store';
import { WeatherService } from '../weather.service';
import { HttpClient } from "@angular/common/http";
import { coord } from "../store/weather.actions";

declare const L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() coords = [0, 0];
  pos: number[] = [];
  marker: any;
  mymap: any;

  constructor(private weatherService: WeatherService, private http: HttpClient, private store: Store) {
  }

  ngOnInit() {
    if(!navigator.geolocation) {console.log("Your geolocation don't work")}

    navigator.geolocation.getCurrentPosition(
      (data)=> {
      this.pos = [data.coords.latitude, data.coords.longitude];
      this.store.dispatch(coord({coords: this.pos}));
      this.coords = this.pos;
      this.createMap();
    },
    (error)=> {console.log(error)}
    )
  }

  createMap() {
    this.mymap = L.map('mapid').setView(this.coords, 3);
    this.marker = L.marker(this.coords).addTo(this.mymap);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGFydXQxOTk0IiwiYSI6ImNrc2syZTg2NzBpdnYyenFvbXowNTgwbmoifQ.WkisctBEhm5SjXPKkdW33g', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(this.mymap);
  }

  ngOnChanges() {
    this.mymap?.flyTo(this.coords, 8)
    this.marker?.setLatLng(this.coords);
  }
}
