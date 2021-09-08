import { createSelector } from "@ngrx/store";
import { CurrentWeather } from "../../shared/CurrentWeather.interface";
import { WeatherState } from '../reducers/city.reducers';


export const citySelector = createSelector(
  (state: WeatherState) => state.city,
  (city: CurrentWeather) => city
)
