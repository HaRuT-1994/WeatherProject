import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'round'
})
export class TempRound implements PipeTransform {

  transform(val: number): number {
    return Math.round(val);
  }

}
