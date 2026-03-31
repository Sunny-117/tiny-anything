import { Observable, Subject } from "rxjs";

//  Subject 和  Observable 区别  Subject 是 可以多播
const subject = new Subject();

subject.subscribe((val) => console.log(`A ${val}`));
subject.subscribe((val) => console.log(`B ${val}`));

subject.next(Math.random());

const observable = new Observable((subscriber) => {
  subscriber.next(Math.random());
});

observable.subscribe((val) => console.log(`A ${val}`));
observable.subscribe((val) => console.log(`B ${val}`));
