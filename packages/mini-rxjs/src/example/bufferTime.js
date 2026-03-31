import { interval } from "rxjs";
import { bufferTime, bufferCount } from 'rxjs/operators';
/* interval(1000)
  .pipe(bufferTime(3000))
  .subscribe(console.log)
 */

interval(1000)
  .pipe(bufferCount(3))
  .subscribe(console.log)