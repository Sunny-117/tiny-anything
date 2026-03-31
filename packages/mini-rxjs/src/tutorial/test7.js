import { interval } from '../rxjs'
interval(1000).subscribe((v) => console.log(v))