import { ProxyRaw, RawProxy, RawShallowProxy, MakeObservableSymbol } from "./environment"
import { isFn, isNormalType } from "./checkers"
import { baseHandlers } from "./handlers"
import { PropertyKey } from "./types"

export const createObservable = (
  target: any,
  key?: PropertyKey,
  value?: any,
  shallow?: boolean
) => {
  if (typeof value !== 'object') {
    return value
  }

  // 对象是否是普通代理，是则直接返回
  const raw = ProxyRaw.get(value)
  // 已经代理过直接返回
  if (!!raw) {
    return value
  }

  // 对象是否是浅层代理，是则直接返回
  if (target) {
    const parentRaw = ProxyRaw.get(target) || target
    const isShallowParent = RawShallowProxy.get(parentRaw)
    if (isShallowParent) { return value }
  }

  // 到这里就是普通对象，下面创建代理对象
  // 创建浅层代理
  if (shallow) { return createShallowProxy(value) }
  // 创建普通代理
  if (isNormalType(value)) { return createNormalProxy(value) }

  return value
}

// 创建浅层代理
const createShallowProxy = (target: any) => {
  if (isNormalType(target)) { return createNormalProxy(target, true) }
}

// 创建普通代理
const createNormalProxy = (target: any, shallow?: boolean) => {
  const proxy = new Proxy(target, baseHandlers)
  // 创建 {代理对象: 原对象} 的映射
  ProxyRaw.set(proxy, target)

  if (shallow) {
    // 浅层代理 创建 {原对象: 代理对象} 的映射
    RawShallowProxy.set(target, proxy)
  } else {
    // 普通代理 创建 {原对象: 代理对象} 的映射
    RawProxy.set(target, proxy)
  }

  return proxy
}


export const createAnnotation = (maker) => {
  const annotation = () => { }
  if (isFn(maker)) {
    annotation[MakeObservableSymbol] = maker
  }
  return annotation
}

export const getObservableMaker = (target: any) => {
  if (target[MakeObservableSymbol]) {
    if (!target[MakeObservableSymbol][MakeObservableSymbol]) {
      return target[MakeObservableSymbol]
    }
    return getObservableMaker(target[MakeObservableSymbol])
  }
}