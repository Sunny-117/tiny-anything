import { share } from "rxjs";

import { fromFetch } from "rxjs/fetch";

// 多个观察者 通过share把 Observable 变成了Subject的使用 结果取的就都是一样的了 ， 不用多次发起请求
const fetchStream = fromFetch("http://localhost:3000/api/user/1").pipe(share());

fetchStream.subscribe((response) => {
  console.log("A", response);
});

fetchStream.subscribe((response) => console.log("B", response));
