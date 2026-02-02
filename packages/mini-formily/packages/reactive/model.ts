
import { isObservable, isAnnotation } from './externals'
import { getObservableMaker } from './internals'

export function define(target, annotations) {
  if (isObservable(target)) { return target }
  
  for (const key in annotations) {
    const annotation = annotations[key]
    // annotation 是否是代理对象，是获取可观察制造者
    if (isAnnotation(annotation)) {
      getObservableMaker(annotation)({ target, key })
    }
  }

  return target
}