export class Subscription {
  _finalizers = [];
  //如何实现取消订阅
  unsubscribe() {
    const { _finalizers } = this;
    for (const finalizer of _finalizers) {
      finalizer();
    }
  }
  add(teardown) {
    this._finalizers.push(teardown);
  }
}
