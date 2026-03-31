import { interval } from "rxjs";
import { bufferTime, bufferCount } from 'rxjs/operators';

const messageBox = document.getElementById('messageBox')
interval(1000)
  .pipe(bufferCount(3))
  .subscribe((messages) => {
    messageBox.innerHTML = messages.map(message => `<li>Message ${message}</li>`)
  })