import { Reaction, ReactionsMap } from "./types";

// 所有普通代理 创建 {代理对象: 原对象} 的映射
export const ProxyRaw = new WeakMap()
// 所有普通代理 创建 {原对象: 代理对象} 的映射
export const RawProxy = new WeakMap()
// 所有浅层代理 创建 {原对象: 代理对象} 的映射
export const RawShallowProxy = new WeakMap()
// 存放所有 effect 函数 {target: {key: [effect, ...]} }
export const RawReactionsMap = new WeakMap<object, ReactionsMap>()

export const ReactionStack: Reaction[] = []

// 制造可观察的符号
export const MakeObservableSymbol = Symbol('MakeObservableSymbol')