import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { WeatherRoutingModule } from './weather-routing.module';

import { WeatherComponent } from './weather.component';
import { MapComponent } from './map/map.component';
import { WeatherChartComponent } from './weather-chart/weather-chart.component';

import { TempRound } from './shared/temp-round.pipe';

import { cityReducer } from './store/reducers/city.reducers';
import { coordsReducer } from './store/reducers/coords.reducer';
import { CityEffects } from './store/effects/city.effects';
import { CoordsEffects } from './store/effects/coords.effects';
import { WeatherService } from './weather.service';


@NgModule({
  declarations: [
    WeatherComponent,
    MapComponent,
    WeatherChartComponent,
    TempRound
  ],
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    WeatherRoutingModule,
    StoreModule.forFeature('city', cityReducer),
    StoreModule.forFeature('coords', coordsReducer),
    EffectsModule.forFeature([CityEffects, CoordsEffects]),
  ],
  exports: [WeatherComponent],
  providers: [WeatherService]
})
export class WeatherModule { }
