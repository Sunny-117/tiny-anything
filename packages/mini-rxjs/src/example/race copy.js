import { Subject, switchMap, concatMap, mergeMap, from } from 'rxjs';

function fetchData(id) {
  return from(new Promise((resolve) => {
    setTimeout(() => resolve(id), 1000 * id)
  }))
}

const search = new Subject()
search.pipe(
  concatMap(fetchData)
).subscribe(console.log)

search.next(3);

setTimeout(() => {
  search.next(1);
}, 1000)
