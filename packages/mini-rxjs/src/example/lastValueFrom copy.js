import { lastValueFrom, interval, take } from 'rxjs';

const source$ = interval(1000)
const lastValue = lastValueFrom(source$.pipe(take(5)));
lastValue.then(val => console.log(val))