import { createAnnotation, createObservable } from '../internals'
import {
  bindTargetKeyWithCurrentReaction,
  runReactionsFromTargetKey,
} from '../reaction'

export interface IObservable {
  <T>(target: T): T
}

// createAnnotation 创建注释
export const observable: IObservable = createAnnotation(
  ({ target, key, value }) => {
    // 把 target 对象的 key 属性变成可观察对象，存放在 store.value
    const store = {
      value: createObservable(target, key, target ? target[key] : value)
    }

    // 触发 get 时将目标键与当前反应绑定
    function get() {
      // （存储effect响应）
      bindTargetKeyWithCurrentReaction({
        target: target,
        key: key,
        type: 'get',
      })
      return store.value
    }

    // 触发 set 时从目标键运行反应
    function set(value: any) {
      const oldValue = store.value

      // 将新改变的 key 变成可观察对象
      value = createObservable(target, key, value)
      store.value = value
      if (oldValue === value) return

      // 从目标键运行反应（触发effect响应）
      runReactionsFromTargetKey({
        target: target,
        key: key,
        type: 'set',
        oldValue,
        value,
      })
    }

    if (target) {
      Object.defineProperty(target, key, {
        get,
        set,
        enumerable: true,    // 可列举
        configurable: false, // 不可配置
      })
      return target
    }

    return store.value
  }
)
