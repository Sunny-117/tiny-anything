import { Observable, throwError, catchError, of } from "rxjs";

const source = new Observable((subscribe) => {
  setTimeout(() => {
    subscribe.error({
      success: false,
    });
  }, 1000);
});

source
  .pipe(
    catchError((error) => {
      throwError(() => ({
        ...error,
        ts: Date.now(),
      }));
    })
  )
  .subscribe({
    next: (val) => console.log("next", val),
    error: (error) => console.error("error", error),
  });
