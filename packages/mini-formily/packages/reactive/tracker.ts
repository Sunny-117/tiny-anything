import { ReactionStack } from './environment'

// Tracker 是暴露给第三方的 effect 函数收集器
export class Tracker {
  private results: any
  constructor(scheduler) {
    this.track._scheduler = scheduler
  }
  
  track = (tracker) => {
    ReactionStack.push(this.track)
    this.results = tracker()
    ReactionStack.pop()

    return this.results
  }
}