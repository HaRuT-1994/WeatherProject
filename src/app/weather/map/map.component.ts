import {Input, Component, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';

declare const L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() coords = [0, 0];
  marker: any;
  myMap: any;
  @Output() maplatlng = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.createMap();
  }

  createMap() {
    this.myMap = L.map('mapid').setView(this.coords, 3);
    this.marker = L.marker(this.coords).addTo(this.myMap);

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
  }

  ngOnChanges() {
    this.myMap?.flyTo(this.coords, 8)
    this.marker?.setLatLng(this.coords);
  }
}
