import { fromEvent } from '../rxjs'

const source = fromEvent(document, 'click');
const subscriber = source.subscribe(console.log)
setTimeout(() => {
  subscriber.unsubscribe();
}, 1000)