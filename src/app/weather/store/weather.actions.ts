import { createAction, props, Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { CoordsModel } from '../shared/coords.interface';

export const cityName = createAction(
  '[Weather Component] cityName',
  props<{city: string}>()
  );

export const coordsAction = createAction(
  '[Weather Component] coords'
  );

export const coordsActionSuccess = createAction(
  '[Weather Component] coords success',
  props<{response: CoordsModel}>()
  );

export const coordsActionFailure = createAction(
  '[Weather Component] coords failure',
  props<{errorResponse: HttpErrorResponse}>()
);
