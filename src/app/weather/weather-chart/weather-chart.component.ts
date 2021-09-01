import { Component, OnChanges, Input, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Store } from "@ngrx/store";
import {map, tap, filter, switchMap} from 'rxjs/operators';
import {environment} from "../../../environments/environment";
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { WeatherService } from "../weather.service";
import {Observable} from "rxjs";
import { CoordsAction } from '../store/weather.actions';

@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.scss']
})
export class WeatherChartComponent implements OnInit, OnChanges {
  @Input()coords: Array<number> = [];
  hours: string[] = [];
  daysInfo = [];
  temp: number[] = [];
  initialized=false;

  constructor(private http: HttpClient, private store: Store<{coords: [number, number]}>, private weatherService: WeatherService) { }

  ngOnInit() {
    // this.initialized = true;
    // this.getChartInfo();
    // this.getWeekData();
    this.store.dispatch(new CoordsAction);
  }

  ngOnChanges(): void {
    this.getChartInfo();
    this.getWeekData();
  }

  getWeekData() {
    this.weatherService.getAllInfo().subscribe(
      (data) => {
        this.daysInfo = data.daily;
      }
    );
  }

  getChartInfo() {
    let myHours = [];
    let myTemp = [];
    this.weatherService.getAllInfo()
    .pipe(
      map((data) => {
        data.hourly.map((data, index) => {
          if(index < 24) {
            let unix_timestamp = data.dt;
            let date = new Date(unix_timestamp * 1000)
            myHours.push(date.getHours() + ':00');
            myTemp.push(Math.round(data.temp));
          }
        })
      })
    ).subscribe(()=>{
      this.hours = myHours;
      this.temp = myTemp;
      myHours = [];
      myTemp = [];
      console.log(this.temp)
      return this.hours, this.temp;
    });


    this.lineChartData = [
      { data: this.temp, label: 'Temperature of the day' },
    ];

    this.lineChartLabels = this.hours;
  }

  lineChartData: ChartDataSets[] = [
    { data: this.temp, label: 'Temperature of the day' },
  ];

  lineChartLabels: Label[] = this.hours;

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
