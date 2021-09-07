import { createReducer, on } from '@ngrx/store';
import { WeekWeather } from '../../shared/WeekWeather.interface';
import { coordsActionSuccess } from '../actions/coords.actions';

export interface WeekWeatherState {
  coords: WeekWeather;
}

const initialState = null;

export const coordsReducer = createReducer(
  initialState,
  on(coordsActionSuccess, (state, { response }) => response )
);
