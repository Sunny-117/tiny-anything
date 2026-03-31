import { interval, of, filter } from "rxjs";


of(1, 2, 3)
  //只支持同步值的转
  .pipe(filter(val => val > 2))
  .subscribe(console.log)