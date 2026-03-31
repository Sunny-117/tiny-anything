import { interval } from 'rxjs';
import { bufferTime } from 'rxjs/operators';
const timer = interval(500);
const bufferedTimer = timer.pipe(bufferTime(1000));
bufferedTimer.subscribe(arr => {
  console.log(arr);
});