import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Observable, ObservableInput, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { WeatherService } from '../weather.service';
import { CoordsAction, CoordsActionType, CoordsFailureAction, CoordsSuccessAction } from './weather.actions';
import { CoordsModel } from '../shared/coords.model';

@Injectable()
export class CreateCoordEffects {

  getCoords$ = createEffect( () =>
    this.actions$
    .pipe(
      ofType(CoordsActionType.COORDS_ACTION),
      switchMap(() => {
        return  this.weatherService.getInfo()
        .pipe(
          map(data => new CoordsSuccessAction(data)),
          catchError(error => of(new CoordsFailureAction(error)))
        )
      })
    )
  )

  // createCoords$ = CoordsEffect(() =>
  //   this.actions$.pipe(
  //     ofType(createCoordsAction),
  //     switchMap(({request}) => {
  //       return this.weatherService.getInfo()
  //     .pipe(
  //       map((response) => {
  //         return createCoordsSuccessAction({response});
  //       }),
  //       catchError(() => of({ type: '[Map Component] Coords Loaded Error' }))
  //       )
  //     })
  //   )
  // )

  constructor(
    private actions$: Actions,
    private weatherService: WeatherService
  ) {}
}
