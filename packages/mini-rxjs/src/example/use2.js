import {
  fromEvent,
  interval,
  from,
  switchMap,
  mergeMap,
  concatMap,
  take,
  takeUntil,
  Subject,
} from "rxjs";

import { withLatestFrom } from "rxjs/operators";
// switchMap 取消之前的 发送新的 支持异步 支持 promise 切换 类似一个防抖效果 等最后一个
// switch 如果上游有新的产生， 老得就不要了
// from => 1 [1,2,3] promise 把值包装成observe对象
// const source$ = interval(1000).pipe(
//   take(3),
//   switchMap((val) =>
//     from(
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(val);
//         }, 2000);
//       })
//     )
//   )
// );

// mergeMap  => 合并 不会取消老得 有值就发送 顺序不固定 无序的 同步映射值
// const source$ = interval(1000).pipe(
//   take(3),
//   mergeMap((val) =>
//     from(
//       new Promise((resolve) => {
//         let delay = 0;
//         if (val === 0) delay = 3;
//         if (val === 1) delay = 2;
//         if (val === 2) delay = 1;
//         setTimeout(() => {
//           resolve(val);
//         }, 1000 * delay);
//       })
//     )
//   )
// );

// concatMap => 有序的 可以异步， 并且可以映射一个 Observable 串行执行，顺序是固定的
// const source$ = interval(1000).pipe(
//   take(3),
//   concatMap((val) =>
//     from(
//       new Promise((resolve) => {
//         let delay = 0;
//         if (val === 0) delay = 3;
//         if (val === 1) delay = 2;
//         if (val === 2) delay = 1;
//         setTimeout(() => {
//           resolve(val);
//         }, 1000 * delay);
//       })
//     )
//   )
// );

// takeUntil: 直到...
// const source$ = interval(1000);
// const stop$ = new Subject();

// // source$ 会不断产出值 ， 直到 stop$ 产出值
// source$.pipe(takeUntil(stop$)).subscribe(console.log);

// setTimeout(() => {
//   stop$.next(100);
// }, 3000);

// withLatestFrom
// 第一次产出值的时候 要求两个可观察对象都有值的时候 才产出值
const first$ = interval(1000);
const second$ = interval(3000);
first$
  .pipe(withLatestFrom(second$))
  .subscribe(([firstVal, secondVal]) => console.log(firstVal, secondVal));
