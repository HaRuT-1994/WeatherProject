import { Component, OnChanges, Input, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Store } from "@ngrx/store";
import {map, filter, switchMap} from 'rxjs/operators';
import { coord } from '../store/weather.actions';
import {environment} from "../../../environments/environment";
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { WeatherService } from "../weather.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.scss']
})
export class WeatherChartComponent implements OnChanges {
  @Input()coords: Array<number> = [];
  date: string[] = [];
  temp: number[] = [];

  constructor(private http: HttpClient, private store: Store<{coords: [number, number]}>, private weatherService: WeatherService) { }

  ngOnChanges(): void {
    this.getHours();
  }

  getHours() {
    this.date = [];
    this.temp = [];
    this.getHoursTemp()
      .pipe(
        map((data: any) => {
          let newData = data.hourly
            newData.map((data: any, index: number) => {
            if(index < 24) {
              let unix_timestamp = data.dt;
              let date = new Date(unix_timestamp * 1000);
              this.date.push(date.getHours() + ':00');
            }
            this.temp.push(Math.round(data.temp) - 273);
          });
        }))
      .subscribe()

    this.lineChartData = [
      { data: this.temp, label: 'Temperature of the day' },
    ];

    this.lineChartLabels = this.date;
  }

  getHoursTemp() {
    // return
        // switchMap(
        //   (coords): Observable<any> => {
            const params = new HttpParams()
              .set('lat', this.coords[0])
              .set('lon', this.coords[1])
              .set('limit', '1')
              .set('appid', environment.openWeatherAPIKey);

            return this.http.get('https://api.openweathermap.org/data/2.5/onecall?', {params});
          }
      // )
  // }

  lineChartData: ChartDataSets[] = [
    { data: this.temp, label: 'Temperature of the day' },
  ];

  lineChartLabels: Label[] = this.date;

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'line';
}
