import { timer } from '../rxjs'
timer(1000).subscribe((xx) => console.log('timer1', xx))