import { interval, of } from "rxjs";
import { map } from 'rxjs/operators';


of(1, 2, 3)
  //只支持同步值的转
  .pipe(map(val => val * 2))
  .subscribe(console.log)