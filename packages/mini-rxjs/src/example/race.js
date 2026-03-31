import { Subject, from, switchMap, concatMap, mergeMap } from "rxjs";
// 竞态
function fetchData(id) {
  return from(
    new Promise((resolve) => {
      setTimeout(() => resolve(id), 1000 * id);
    })
  );
}

const search = new Subject();

search.pipe(mergeMap(fetchData)).subscribe(console.log);

search.next(3);
setTimeout(() => {
  search.next(1);
}, 1000);
