import { Observable } from "../Observable"
export function take(count) {
  //source上游的可观察对象
  return source => {
    //记数器用来记录已经获取的值和数量
    let seen = 0;
    return new Observable(function (subscriber) {
      return source.subscribe({
        ...subscriber,
        //最关键的是要重写next方法,此value是老的Observable传过来的老值
        next: (value) => {
          seen++;
          if (seen <= count) {
            subscriber.next(value);
            if (seen >= count) {
              subscriber.complete();
            }
          }
        }
      })
    });
  }
}