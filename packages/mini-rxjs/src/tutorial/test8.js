import { interval, take } from '../rxjs'
interval(500)
    .pipe(take(5))
    .subscribe(console.log)
// 0
// 1
// 2