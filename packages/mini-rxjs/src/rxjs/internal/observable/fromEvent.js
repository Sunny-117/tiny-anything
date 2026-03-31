import { Observable } from "../Observable";

export function fromEvent(target, eventName) {
  return new Observable((subscriber) => {
    //1.创建事件函数函数
    const handler = (...args) => subscriber.next(...args);
    //给DOM元素绑定事件名对应的处理函数
    target.addEventListener(eventName, handler);
    //_subscribe执行的结果可以返加一个取消订阅的函数
    return () => {
      target.removeEventListener(eventName, handler);
    };
  });
}
