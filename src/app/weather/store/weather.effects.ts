import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { WeatherService } from '../weather.service';
import { coordsAction, coordsActionSuccess, coordsActionFailure } from './weather.actions'

@Injectable()
export class CoordsEffects {

  loadCoords$ = createEffect(() => this.actions$.pipe(
    ofType('[Weather Component] coords'),
    switchMap(() => this.weatherService.getInfo()
      .pipe(
        map(response => {
          return coordsActionSuccess({response});
        }),
        catchError((errorResponse) => {
          return of(coordsActionFailure({errorResponse}));
          })
        )
      )
  ));

  constructor(
    private actions$: Actions,
    private weatherService: WeatherService
  ) {}
}
