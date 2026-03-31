import { Observable } from 'rxjs'
const source$ = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
})
const observer = {
  next: (val) => console.log('next', val),
  complete: () => console.log('complete')
};
source$.subscribe(observer);