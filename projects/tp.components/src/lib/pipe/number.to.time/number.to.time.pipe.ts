import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberToTime',
  standalone: true
})
export class NumberToTimePipe implements PipeTransform {

  transform(value: number | null): string {
    if (value === null || isNaN(value)) {
      return '00:00:00';
    }
    const hours: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value - hours * 3600) / 60);
    const seconds = Math.trunc((value - hours * 3600 - minutes * 60));
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

}
