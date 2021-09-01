import { state } from '@angular/animations';
import { Action, createReducer, on } from '@ngrx/store';
import { CoordsModel } from '../shared/coords.model';
import * as WeatherAction from './weather.actions';
import { CoordsActionType, CoordAction} from './weather.actions'


export interface CoordsState {
  coords: CoordsModel[],
  error: Error
}

export const initialState = '';
export const initialCoordsState: CoordsState = {
  coords: [],
  error: undefined
}

const _weatherReducer = createReducer(
  initialState,
  on(WeatherAction.cityName, (state, { city }) =>  city )
);

export function weatherReducer(state=initialState, action: Action) {
  return _weatherReducer(state, action);
}

export function CoordsReducer(state: CoordsState = initialCoordsState, action: CoordAction) {
  switch(action.type) {
    case CoordsActionType.COORDS_ACTION:
      return {...state};
    case CoordsActionType.COORDS_ACTION_SUCCESS:
      return {...state, coords: action.payload};
      case CoordsActionType.COORDS_ACTION_FAILURE:
        return {...state, error: action.payload}
    default: return state;
  }
}


