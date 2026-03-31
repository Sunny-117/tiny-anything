import {
  Observable,
  of,
  from,
  fromEvent,
  map,
  scan,
  filter,
  interval,
  Subject,
} from "rxjs";

import { bufferTime, bufferCount } from "rxjs/operators";

// const observable = new Observable((subscribe) => {
//   subscribe.next(1);
//   subscribe.next(2);
//   subscribe.next(3);
//   subscribe.complete();
//   subscribe.next(3);
// });

// const observer = {
//   next: (value) => console.log(value),
//   error: (err) => console.log(err),
//   complete: () => console.log("complete"),
// };
// // observable.subscribe(observer);
// observable.subscribe((value) => console.log(value));

// of
// const arrayLikeObservable = of(1, 2, 3);
// arrayLikeObservable.subscribe({
//   next: (value) => console.log("arrayLikeObservable", value),
//   complete: () => console.log("arrayLikeObservable complete"),
// });

// from
// const promiseLikeObservable = from(Promise.resolve(4));
// promiseLikeObservable.subscribe({
//   next: (value) => console.log("arrayLikeObservable", value),
//   complete: () => console.log("promiseLikeObservable complete"),
// });

// fromEvent
// const clicks = fromEvent(document, "click");
// const fn = clicks.subscribe((x) => {
//   console.log(x);
//   fn.unsubscribe();
// });

// map 、filter

// of([1, 2, 3]) // 1，2，3
//   .pipe(map((val) => val * 2))
//   .pipe(filter((val) => val * 2))
//   .subscribe(console.log);

// of(1, 2, 3) // 1，2，3
//   .pipe(
//     map((x) => x + x),
//     filter((val) => val > 3)
//   )
//   .subscribe((a) => console.log(a));

// Subject 即能订阅 也能发送
// const source$ = new Subject();
// source$.subscribe((val) => console.log("subject 订阅A", val));
// source$.next(1);
// source$.next(2);
// source$.subscribe((val) => console.log("subject 订阅B", val));
// source$.next(3);
// source$.next(4);

// interval
// interval(1000).subscribe((a) => console.log(a));

// bufferTime
interval(1000)
  .pipe(bufferCount(3)) // 缓存3s
  .subscribe(console.log);
