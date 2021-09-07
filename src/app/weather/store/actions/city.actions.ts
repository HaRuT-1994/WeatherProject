
import { createAction, props } from '@ngrx/store';
import { CurrentWeather } from '../../shared/CurrentWeather.interface';

export const cityAction = createAction(
  '[Weather Component] get city',
  props<{request: string}>()
  );

export const cityActionSuccess = createAction(
  '[City Effect] get weather info',
  props<{ response: any }>()
);
