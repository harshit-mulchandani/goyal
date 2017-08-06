/**
 * Created by Harshit on 14-07-2017.
 */
import {Pipe} from '@angular/core';

@Pipe({name: 'round'})
export class RoundPipe {
  transform (input:number) {
    return Math.ceil(input);
  }
}
