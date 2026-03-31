
import { interval, withLatestFrom } from 'rxjs';
/**
first$:  -----0-----1-----2-----3-----4-----5|
second$: -----------------0-----------------1|
result$: -----------------[2,0]--[3,0]-[4,0]-[5,1]|
 */

const first$ = interval(1000)
const second$ = interval(3000)
first$.pipe(
  withLatestFrom(second$)
).subscribe(([firstVal, secondVal]) => console.log(firstVal, secondVal))

/**
 * 第一次产出值的时候要求两个可观察对象都有值
 */