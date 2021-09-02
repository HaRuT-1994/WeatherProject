import { Action, createReducer, on } from '@ngrx/store';
import * as WeatherAction from './weather.actions';
import { CoordsModel } from '../shared/coords.interface';
import { cityName, coordsAction, coordsActionSuccess,coordsActionFailure } from './weather.actions'

export const initialState = '';
export const initialCoordsState: CoordsModel  = {coord: {'lat': 0, 'lon': 0}};

const _weatherReducer = createReducer(
  initialState,
  on(cityName, (state, { city }) =>  city )
);

export function weatherReducer(state=initialState, action: Action) {
  return _weatherReducer(state, action);
}

const _coordsReducer = createReducer(
  initialCoordsState,
  on(coordsAction, (state) => state),
  on(coordsActionSuccess, (state, {response}) => state = {coord: {lat: response.coord.lat, lon: response.coord.lon }}),
  on(coordsActionFailure, () => {throw 'failed coords';})
);

export function coordsReducer(state, action) {
  return _coordsReducer(state, action);
}
