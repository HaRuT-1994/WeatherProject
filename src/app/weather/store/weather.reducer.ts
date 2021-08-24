import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import { Action } from '@ngrx/store';
import * as WeatherAction from './weather.actions';

export const initialState = '';
export const initialStateCoords = [0, 0];

const _weatherReducer = createReducer(
  initialState,
  on(WeatherAction.cityName, (state, { city }) =>  city )
);

export function weatherReducer(state=initialState, action: Action) {
  return _weatherReducer(state, action);
}


const _mapReducer = createReducer(
  initialStateCoords,
  on(WeatherAction.coord, (state, { coords }) =>  coords)
);

export function mapReducer(state=initialStateCoords, action: Action) {
  return _mapReducer(state, action);
}
