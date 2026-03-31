import { Observable, catchError, of, throwError, Subscriber } from 'rxjs';
// /catchError允许 你捕获一个发错并返回新的Observable

const source = new Observable(subscriber => {
  setTimeout(() => {
    subscriber.error(new Error('错误'))
  }, 1000)
});
source
  .pipe(
    catchError(error => of('正常值'))
  ).subscribe({
    next: val => console.log('next', val),
    error: error => console.error('error', error)
  })
  //throwError是用来显示的抛出一个错误