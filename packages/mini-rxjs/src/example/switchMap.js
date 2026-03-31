import { interval, switchMap, from, take } from 'rxjs'

/* 
from(1)
from([1, 2, 3])
from(Promise.resolve) */
//interval 操作符会创建一个可观察对象，它会每隔一段时间发出一个数字
//在这个例子中，它会每隔 1000 毫秒发出一个数字
const source$ = interval(1000)
  .pipe(take(3))
  .pipe(
    //可以支持异步，可以支持Promise
    //switch的意思是如果上游产生了新的值，那么上一个产出的值对应的Observable就不要了
        //switchMap 操作符。它会将每个值映射成一个新的可观察对象，并且在这个新的可观察对象发出值之前，会取消订阅之前的可观察对象
    //在这个例子中，每个值都会被映射成一个 Promise，该 Promise 在 2 秒后被解析
    //最后使用 from 操作符将 Promise 转换为可观察对象

    switchMap(val => from(new Promise((resolve) => {
      setTimeout(() => resolve(val), 2000)
    })))
  )
source$.subscribe(console.log)