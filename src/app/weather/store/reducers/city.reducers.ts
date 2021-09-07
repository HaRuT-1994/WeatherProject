import { createReducer, on } from '@ngrx/store';
import { CurrentWeather } from '../../shared/CurrentWeather.interface';
import { cityActionSuccess } from '../actions/city.actions';

export interface WeatherState {
  city: CurrentWeather;
}

const initialState = null;

export const cityReducer = createReducer(
  initialState,
  on(cityActionSuccess, (state, { response }) => response )
);
