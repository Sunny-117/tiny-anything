import { asyncScheduler } from '../rxjs'
function task(state) {
  console.log('state: ', state);
  if (state < 5) {
    this.schedule(state + 1, 1000);
  }
}
asyncScheduler.schedule(task, 1000, 0);