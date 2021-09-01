import { createAction, props, Action } from '@ngrx/store';
import { MapComponent } from '../map/map.component';
import { CoordsModel} from '../shared/coords.model';

export const cityName = createAction(
  '[Weather Component] cityName',
  props<{city: string}>()
  );

// export const coord = createAction(
//   '[Map Component] coord',
//   props<{ coords: [number, number] }>()
// )

export enum CoordsActionType {
  COORDS_ACTION = '[Map Component] get Coords',
  COORDS_ACTION_SUCCESS = '[Map Component] get Coords Success',
  COORDS_ACTION_FAILURE = '[Map Component] get Coords'
}

export class CoordsAction implements Action {
  readonly type = CoordsActionType.COORDS_ACTION;
}

export class CoordsSuccessAction implements Action {
  readonly type = CoordsActionType.COORDS_ACTION_SUCCESS;

  constructor(public payload: any) {}
}

export class CoordsFailureAction implements Action {
  readonly type = CoordsActionType.COORDS_ACTION_FAILURE;

  constructor(public payload: Error) {}
}

export type CoordAction = CoordsAction
                        | CoordsSuccessAction
                        | CoordsFailureAction;
