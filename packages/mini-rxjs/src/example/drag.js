import {
  withLatestFrom,
  takeUntil,
  switchMap,
  throttleTime,
  debounceTime,
} from "rxjs/operators";

import { fromEvent } from "rxjs";

const draggableElement = document.getElementById("draggable");

const mouseDown$ = fromEvent(draggableElement, "mousedown");
const mouseMove$ = fromEvent(draggableElement, "mousemove").pipe(
  throttleTime(30)
);
const mouseUp$ = fromEvent(draggableElement, "mouseup");

mouseDown$
  .pipe(
    switchMap(() =>
      mouseMove$.pipe(takeUntil(mouseUp$.pipe(debounceTime(500))))
    ),
    withLatestFrom(mouseDown$, (moveEvent, downEvent) => {
      return {
        left: moveEvent.clientX - downEvent.offsetX,
        top: moveEvent.clientY - downEvent.offsetY,
      };
    })
  )
  .subscribe(({ left, top }) => {
    console.log(left, top);
    draggableElement.style.left = left + "px";
    draggableElement.style.top = top + "px";
  });
