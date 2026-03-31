import { Subject } from '../rxjs';
const source = new Subject();
source.subscribe({ next: data => console.log(`Subject 第一次订阅: ${data}`) });
source.next(1);
source.next(2);
source.subscribe({ next: data => console.log(`Subject 第二次订阅: ${data}`) });
source.next(3);
source.next(4);