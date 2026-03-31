
export class AsyncAction {
  pending = false
  constructor(work) {
    this.work = work;
  }
  //当调用此方法的时候，我要在delay时间后，以state作为参数调用work方法
  schedule(state, delay = 0) {
    this.state = state;
    this.delay = delay;
    if (this.timerID !== null) {
      this.timerID = this.recycleAsyncId(this.timerID)
    }
    //表示有任务等待执行
    this.pending = true;
    this.timerID = this.requestAsyncId(delay);
  }
  recycleAsyncId(timerID) {
    if (timerID !== null) {
      clearInterval(timerID)
    }
    return null;
  }
  requestAsyncId(delay = 0) {
    return setInterval(this.execute, delay)
  }
  execute = () => {
    //execute里都赋值isPending为false了，为啥还需要判断??
    this.pending = false;
    this.work(this.state);
    //如果在 work中没有调度新的任务的话，那就把定时器也清掉
    if (this.pending === false && this.timerID !== null) {
      this.timerID = this.recycleAsyncId(this.timerID);
    }
  }
}