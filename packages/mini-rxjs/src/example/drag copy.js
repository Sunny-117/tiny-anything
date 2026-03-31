import { fromEvent, withLatestFrom, takeUntil, switchMap, throttleTime, debounceTime, from } from 'rxjs';

const draggableElement = document.getElementById('draggable')
const mouseDown$ = fromEvent(draggableElement, 'mousedown');
const mouseMove$ = fromEvent(draggableElement, 'mousemove').pipe(throttleTime(30));
const mouseUp$ = fromEvent(draggableElement, 'mouseup');

mouseDown$.pipe(
  switchMap(() => mouseMove$.pipe(takeUntil(mouseUp$.pipe(debounceTime(500))))),
  withLatestFrom(mouseDown$, (moveEvent, downEvent) => {
    return {
      left: moveEvent.clientX - downEvent.offsetX,
      top: moveEvent.clientY - downEvent.offsetY
    }
  })
).subscribe(({ left, top }) => {
  draggableElement.style.left = left + 'px';
  draggableElement.style.top = top + 'px';
})
mouseDown$.unsubscribe();
mouseMove$.unsubscribe();
mouseUp$.unsubscribe();
/**
 * switchMap上已经消费了一次 mouseDown，转化成 mouseMove，
 * 为啥下面的 withLatestFrom 还能拿到 mouseDonw
 */


