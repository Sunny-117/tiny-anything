import { ReactionStack } from './environment'
import { Reaction } from "./types";
import { isFn } from "./checkers";

export const autorun  = (tracker: Reaction, name = 'AutoRun') => {
  const reaction: Reaction = () => {
    if (!isFn(tracker)) { return }

    try {
      ReactionStack.push(reaction) // 将 effect 函数存入反应堆
      tracker()
    } finally {
      ReactionStack.pop() // 将 effect 函数取出反应堆
    }
  }
  reaction()

  return () => {
    // 销毁副作用函数
  }
}