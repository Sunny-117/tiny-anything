import * as annotations from './annotations'
import { MakeObservableSymbol } from './environment'
import { createObservable } from './internals'

export function observable<T extends object>(target: T): T {
  return createObservable(null, null, target)
}

// 浅层响应式
observable.shallow = annotations.shallow;
// 制造可观察的符号
observable[MakeObservableSymbol] = annotations.observable;