import { Observable, Subject } from "rxjs";
/* const subject = new Subject();
subject.subscribe(val => console.log(`A:${val}`))
subject.subscribe(val => console.log(`A:${val}`))
subject.next(Math.random())
 */
const observable = new Observable((subscriber) => {
  subscriber.next(Math.random());
});
observable.subscribe(val => console.log(`A:${val}`))
observable.subscribe(val => console.log(`B:${val}`))