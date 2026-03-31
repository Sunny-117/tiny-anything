import { Observable } from "../Observable";
import { isPromise } from "../util/isPromise";
import { isArrayLike } from "../util/isArrayLike";
/**
 * 是要把input转成Observable
 * @param {*} input
 * @returns
 */
export function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (isArrayLike(input)) {
    return fromArrayLike(input);
  }
  if (isPromise(input)) {
    return fromPromise(input);
  }
}
export function fromArrayLike(arrayLike) {
  console.log(arrayLike, "arrayLike");
  return new Observable((subscriber) => {
    for (let i = 0; i < arrayLike.length; i++) {
      subscriber.next(arrayLike[i]);
    }
    subscriber.complete();
  });
}

export function fromPromise(promise) {
  return new Observable((subscriber) => {
    promise.then(
      (value) => {
        subscriber.next(value);
        subscriber.complete();
      },
      (error) => {
        subscriber.error(error);
        subscriber.complete();
      }
    );
  });
}
