import { createAnnotation } from '../internals'
import {
  bindTargetKeyWithCurrentReaction,
  runReactionsFromTargetKey,
} from '../reaction'

export interface IShallow {
  <T>(target: T): T
}

// shallow 浅层响应式，不会递归将嵌套对象变成响应式
export const shallow: IShallow = createAnnotation(
  ({ target, key, value }) => {
    const store = {
      value: target ? target[key] : value
    }

    function get() {
      bindTargetKeyWithCurrentReaction({
        target: target,
        key: key,
        type: 'get',
      })
      return store.value
    }

    function set(value: any) {
      const oldValue = store.value
      store.value = value
      if (oldValue === value) return

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
        enumerable: true,
        configurable: false,
      })
      return target
    }

    return store.value
  }
)
