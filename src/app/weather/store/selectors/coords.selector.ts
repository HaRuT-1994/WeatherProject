import { createSelector } from "@ngrx/store";
import { WeekWeather } from "../../shared/WeekWeather.interface";
import { WeekWeatherState } from '../reducers/coords.reducer';


export const coordsSelector = createSelector(
  (state: WeekWeatherState) => state.coords,
  (coords: WeekWeather) => coords
)
