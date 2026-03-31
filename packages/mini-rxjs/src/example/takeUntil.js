import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const source$ = interval(1000);
const stop$ = new Subject();
//source$会不断的产出值，直到stop$产出值为止
source$
  .pipe(takeUntil(stop$))
  .subscribe(console.log)

setTimeout(() => { stop$.next(100) }, 3000)