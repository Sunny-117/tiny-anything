import { Observable } from "./Observable";
// 多播 即使观察者 又是可观察者
// const source = new Subject()
// source.next()
export class Subject extends Observable {
  observers = [];
  _subscribe(subscriber) {
    this.observers.push(subscriber);
  }
  next(value) {
    for (const subscriber of this.observers) {
      subscriber.next(value);
    }
  }
  complete() {
    for (const subscriber of this.observers) {
      subscriber.complete();
    }
  }
}
