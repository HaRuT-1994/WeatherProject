import { Component, OnChanges, Input, OnInit} from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Store, select } from '@ngrx/store';
import { WeekWeatherState } from '../store/reducers/coords.reducer';
import { Subscription } from 'rxjs';
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
  data: any = [];

  constructor( private store: Store<WeekWeatherState> ) { }

  ngOnInit() {
    this.store.pipe(select('coords'),
    filter(data => data !== null),
    map(data => {
      this.daysInfo = data.daily;
      data.hourly.map((data, index) => {
        if(index < 24) {
          let unix_timestamp = data.dt;
          let date = new Date(unix_timestamp * 1000)
          this.hours.push(date.getHours() + ':00');
          this.temp.push(Math.round(data.temp));
        }
      })

      this.data = [this.hours, this.temp]
      this.hours = [];
      this.temp = [];
      return this.data;
    })
    ).subscribe( () => {
      this.lineChartData = [
        { data: this.data[1], label: 'Temperature of the day' }
        ];

      this.lineChartLabels = this.data[0];
    })
  }

  ngOnChanges(): void {  }

  lineChartData: ChartDataSets[] = [
    { data: this.data[1], label: 'Temperature of the day' },
  ];

  lineChartLabels: Label[] = this.data[0];

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
