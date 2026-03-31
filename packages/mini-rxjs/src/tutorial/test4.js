import { of, map, filter } from '../rxjs'
const subscriber = of(1, 2, 3)
  .pipe(map(val => val * 2))// [2,4,6]
  .pipe(filter(val => val > 3))//[4,6]
  .pipe(map(data => data + 1))//[5,7]
subscriber.subscribe(console.log)