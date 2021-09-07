import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // Angular CLI environment

import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { MapComponent } from './weather/map/map.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { cityReducer } from './weather/store/reducers/city.reducers';
import { WeatherChartComponent } from './weather/weather-chart/weather-chart.component';
import { ChartsModule } from 'ng2-charts';
import { EffectsModule } from '@ngrx/effects';
// import { CoordsEffects } from './weather/store/effects/coords.effects';
import { CityEffects } from './weather/store/effects/city.effects';
import { CoordsEffects } from './weather/store/effects/coords.effects';

import {TempRound} from './weather/shared/temp-round.pipe';
import { coordsReducer } from './weather/store/reducers/coords.reducer';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    MapComponent,
    WeatherChartComponent,
    TempRound
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ city: cityReducer, coords: coordsReducer }),
    EffectsModule.forRoot([CityEffects, CoordsEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
