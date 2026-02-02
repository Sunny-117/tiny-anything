import { ReactionStack, RawReactionsMap } from "./environment"
import { Reaction, IOperation, PropertyKey } from "./types"
import { ArraySet } from "./array";
import { isFn } from "./checkers";

/**
 * get 时收集对应 key: [effect, ...] 函数
 * @param operation 
 */
export const bindTargetKeyWithCurrentReaction = (operation: IOperation) => {
  const { target, key } = operation
  const currentReaction = ReactionStack[ReactionStack.length - 1]
  if (currentReaction) {
    addRawReactionsMap(target, key, currentReaction)
  }
}

const addRawReactionsMap = (
  target: any,
  key: PropertyKey,
  reaction: Reaction
) => {
  const reactionsMap = RawReactionsMap.get(target)
  if (reactionsMap) {
    const reactionSet = reactionsMap.get(key)
    if (reactionSet) {
      reactionSet.add(reaction)
    } else {
      reactionsMap.set(key, new ArraySet([reaction]))
    }
    return reactionsMap
  } else {
    const reactionsMap = new Map([
      [ key, new ArraySet([reaction]) ]
    ])
    RawReactionsMap.set(target, reactionsMap)
    return reactionsMap
  }
}

/**
 * set 时运行对应 key: [effect, ...] 函数
 * @param operation 
 */
export const runReactionsFromTargetKey = (operation: IOperation) => {
  const { target, key } = operation
  runReactions(target, key)
}

function runReactions(target: any, key: PropertyKey) {
  const reactions = getReactionsFromTargetKey(target, key)
  for (let i = 0, len = reactions.length; i < len; i++) {
    const reaction = reactions[i]
    if (isFn(reaction._scheduler)) {
      reaction._scheduler(reaction)
    } else {
      reaction()
    }
  }
}

/**
 * 获取代理对象的 key 属性对应所有 effect 函数
 * @param target 代理对象
 * @param key 被代理的key
 */
const getReactionsFromTargetKey = (target, key) => {
  const reactionsMap = RawReactionsMap.get(target)
  const reactions = []
  if (reactionsMap) {
    const map = reactionsMap.get(key)
    map?.forEach((reaction) => {
      if (reactions.indexOf(reaction) === -1) {
        reactions.push(reaction)
      }
    })
  }
  return reactions
}