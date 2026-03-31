import { merge, of } from "rxjs";

merge(of(1, 2, 3), of(4, 5, 6)).subscribe(console.log);
