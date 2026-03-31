import { Subject } from 'rxjs'
const source$ = new Subject();
source$.subscribe((val) => console.log('Subject订阅A', val));
source$.next(1);
source$.next(2);
source$.subscribe((val) => console.log('Subject订阅B', val));
source$.next(3);
source$.next(4);