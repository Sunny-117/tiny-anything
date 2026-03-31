import {of, from} from '../rxjs'

const arrayLike = of(1, 2, 3)
arrayLike.subscribe({
  next: value => console.log(`arrayLike:`, value),
  complete: () => console.log('arrayLike done'),
});

const promiseLike = from(Promise.resolve(4))

promiseLike.subscribe({
  next: value => console.log(`promiseLike:`, value),
  complete: () => console.log('promiseLike done'),
});