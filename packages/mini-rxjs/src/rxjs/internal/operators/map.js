import { Observable } from "../Observable";
export function map(project) {
  //operation 传入老的Observable,返回新的Observable
  return (source) => {
    return new Observable(function (subscriber) {
      return source.subscribe({
        ...subscriber,
        //最关键的是要重写next方法,此value是老的Observable传过来的老值
        next: (value) => {
          subscriber.next(project(value));
        },
      });
    });
  };
}
