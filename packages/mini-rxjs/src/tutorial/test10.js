import { Subject } from '../rxjs'
const subject = new Subject();

subject.subscribe({ next: data => console.log('observerA: ', data) });
subject.subscribe({ next: data => console.log('observerB: ', data) });

subject.next(1);
subject.next(2);

// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2