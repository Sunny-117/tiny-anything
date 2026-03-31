import { Subscriber } from "./Subscriber";
import { pipeFromArray } from "./util/pipe";

export class Observable {
  constructor(subscribe) {
    if (subscribe) {
      // 保存订阅函数，在创建实例的时候函数并没有执行
      this._subscribe = subscribe;
    }
  }

  // 当调用Observable的subscribe方法的时候，就要开始执行_subscribe
  subscribe(observer) {
    // this._subscribe(observer);
    // 创建一个订阅者对象
    const subscriber = new Subscriber(observer);
    //订阅函数执行后会返回一个销毁函数
    const teardown = this._subscribe(subscriber);
    //把销毁函数存放到subscriber
    subscriber.add(teardown);
    return subscriber;
  }

  pipe(...operations) {
    //把老的Observable传递给operation的source参数
    //return operation(this);
    return pipeFromArray(operations)(this);
  }
}
