import { Observable, throwIfEmpty } from 'rxjs';

const source = new Observable(subscriber => {
  //subscriber.next(1);
  //如果生产任何的值，直接完成
  subscriber.complete();
}).pipe(
  throwIfEmpty()
).subscribe({
  next: console.log,
  error: console.error
})