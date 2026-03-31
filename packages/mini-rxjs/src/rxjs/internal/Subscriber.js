import { isFunction } from "./util/isFunction";
import { Subscription } from "./Subscription";

export class Subscriber extends Subscription {
  isStoped = false;

  constructor(observerOrNext) {
    super();
    let observer;
    if (isFunction(observerOrNext)) {
      observer = {
        next: observerOrNext,
      };
    } else {
      observer = observerOrNext;
    }
    // 把观察者对象存到了订阅者对象的destination属性上
    this.destination = observer;
  }
  next(value) {
    if (!this.isStoped) {
      this.destination.next(value);
    }
  }
  complete() {
    if (!this.isStoped) {
      this.isStoped = true;
      this.destination.complete?.();
    }
  }
}
