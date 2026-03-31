import {
  Observable,
  of,
  from,
  fromEvent,
  map,
  scan,
  filter,
  interval,
  Subject,
} from "rxjs";

import { bufferTime, bufferCount } from "rxjs/operators";

const messageBox = document.getElementById("messageBox");

interval(1000)
  .pipe(bufferCount(3)) // 缓存3s
  .subscribe((msgs) => {
    messageBox.innerHTML = msgs.map((msg) => `<li>${msg}</li>`);
  });
