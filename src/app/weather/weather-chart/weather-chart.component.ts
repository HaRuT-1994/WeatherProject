import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { WeatherService } from "../weather.service";
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

  constructor( private weatherService: WeatherService ) { }

  ngOnInit() {this.getChartInfo();  }

  ngOnChanges(): void {

  }

  getChartInfo() {
    let myHours = [];
    let myTemp = [];
    this.weatherService.getAllInfo()
    .pipe(
      map((data) => {
        this.daysInfo = data.daily;
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
      console.log(this.hours, this.temp)
      return this.hours, this.temp;
    });

    this.lineChartData = [
      { data: this.temp, label: 'Temperature of the day' }
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
