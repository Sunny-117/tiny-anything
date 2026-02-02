import { RawProxy } from "./environment";
import { createObservable } from "./internals";
import { bindTargetKeyWithCurrentReaction, runReactionsFromTargetKey } from "./reaction";
import { isObservable } from './externals';

export const baseHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (!key) { return }
    const result = target[key]

    // get 时收集 effect 函数
    bindTargetKeyWithCurrentReaction({ target, key })
    
    // 此对象已创建代理对象，直接返回
    const observableResult = RawProxy.get(result)
    if (observableResult) {
      return observableResult
    }

    // 此对象未创建代理对象，则创建代理对象并返回
    if (!isObservable(result)) {
      return createObservable(target, key, result)
    }

    return result
  },
  set(target, key, value) {
    const newValue = createObservable(target, key, value);
    target[key] = newValue

    // set 时运行 effect 函数
    runReactionsFromTargetKey({ target, key })

    return true
  }
}