import { merge, of } from 'rxjs'
const first = of(1, 2, 3)
const second = of(4, 5, 6)
merge(first, second).subscribe(console.log)