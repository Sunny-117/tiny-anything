import { share } from 'rxjs'
import { fromFetch } from 'rxjs/fetch';
const fetchStream = fromFetch('http://localhost:8080/api/user/1').pipe(share());

fetchStream.subscribe(response => {
  console.log('A', response);
})
fetchStream.subscribe(response => {
  console.log('B', response);
})
