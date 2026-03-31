import { interval, concatMap, from, take } from 'rxjs'

/* 
from(1)
from([1, 2, 3])
from(Promise.resolve) */
//1 0 3
//2 1 2
//3 2 1
const source$ = interval(1000)
  .pipe(take(3))
  .pipe(
    //可以支持异步，可以支持Promise
    //switch的意思是如果上游产生了新的值，那么上一个产出的值对应的Observable就不要了
    concatMap(val => from(new Promise((resolve) => {
      let delay = 0;
      if (val === 0) delay = 3;
      if (val === 1) delay = 2;
      if (val === 3) delay = 1;
      setTimeout(() => resolve(val), 1000 * delay)
    })))
  )
source$.subscribe(console.log)

/**
1
0
2
 */