import { createAction, props } from '@ngrx/store';

export const cityName = createAction(
  '[Weather Component] cityName',
  props<{city: string}>()
  );

export const coord = createAction(
  '[Map Component] coord',
  props<{ coords: [number, number] }>()
)

