import { CoordsState } from './weather.reducer';

export interface AppState {
  readonly coords: CoordsState;
}
