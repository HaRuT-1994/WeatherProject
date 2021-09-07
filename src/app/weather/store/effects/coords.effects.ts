import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError,mergeMap, switchMap,  exhaustMap, map, tap } from 'rxjs/operators';
import { WeatherService } from '../../weather.service';
import { coordsAction, coordsActionSuccess } from '../actions/coords.actions';

@Injectable()
export class CoordsEffects {
  loadWeather$ = createEffect(() =>
    this.action$.pipe(
      ofType(coordsAction),
      exhaustMap(({request}) =>
       this.weatherService.getAllInfo(request).pipe(
          map((response) => coordsActionSuccess({response})),
          catchError(() => {throw 'error ocurs'})

       )
      ))
  )

  constructor(private action$: Actions, private weatherService: WeatherService) {}
}
