import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { EmptyError } from 'rxjs';
import { catchError,mergeMap, switchMap,  exhaustMap, map, tap } from 'rxjs/operators';
import { WeatherService } from '../../weather.service';
import {
  cityAction,
  cityActionSuccess
} from '../actions/city.actions';

@Injectable()
export class CityEffects {
  loadWeather$ = createEffect(() =>
    this.action$.pipe(
      ofType(cityAction),
      exhaustMap(({request}) =>
       this.weatherService.getInfoByCity(request).pipe(
          map((response) => cityActionSuccess({response})),
          catchError(() => {throw 'error ocurs'})

       )
      ))
  )

  constructor(private action$: Actions, private weatherService: WeatherService) {}
}
