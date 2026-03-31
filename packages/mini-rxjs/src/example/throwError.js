import { Observable, catchError, of, throwError, Subscriber } from 'rxjs';
// /catchError允许 你捕获一个发错并返回新的Observable

const source = new Observable(subscriber => {
  setTimeout(() => {
    subscriber.error({ success: false })
  }, 1000)
});
source
  .pipe(
    catchError(error => throwError(() => ({ ...error, ts: Date.now() })))
  ).subscribe({
    next: val => console.log('next', val),
    error: error => console.error('error', error)
  })
  //throwError是用来显示的抛出一个错误

/*   catchErro try catch
  throw Error  throw new Error */