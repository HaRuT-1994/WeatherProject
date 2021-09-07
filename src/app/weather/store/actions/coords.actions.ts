import { createAction, props, Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { WeekWeather } from '../../shared/WeekWeather.interface';

export const coordsAction = createAction(
  '[Weather Component] coords',
  props<{request: number[]}>()
  );

export const coordsActionSuccess = createAction(
  '[Coords Effect] week weather success',
  props<{response: WeekWeather}>()
  );

export const coordsActionFailure = createAction(
  '[Coords Effect] coords failure',
  props<{errorResponse: HttpErrorResponse}>()
);
