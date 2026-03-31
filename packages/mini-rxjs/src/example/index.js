import { http } from './fetch/http';

const requestId = Date.now()
http.get('http://localhost:8080/api/user/1', {}, requestId).then(response => {
  //response.json().then(data => console.log(data))
  console.log(response.data);
}, error => {
  console.error(error);
})
setTimeout(() => {
  http.cancel(requestId)
}, 1000)

/* http.post('http://localhost:8080/api/user', { name: 'zhangsan' }).then(response => {
  //response.json().then(data => console.log(data))
  console.log(response.data);
}) */

/* http.request(
  {
    url: 'http://localhost:8080/api/user/1',
    method: 'GET'
  }
).then(response => {
  console.log(response);
})

 */





















//import './Observable'
//import './Subject'
//import './interval'
//import './bufferTime'
//import './buffer'
//import './map'//同步的映射出一值
//import './switchMap'//可以异步，并且可以映射出一个Observable 有新的老的不要了
//import './mergeMap'//可以异步，并且可以映射出一个Observable  并发行执行，顺序不固定
//import './concatMap'//可以异步，并且可以映射出一个Observable   串行执行，顺序是固定的
//import './takeUntil'
//import './withLatestFrom'
//import './drag'
//import './multiRequest'
//import './race'
//import './board'
//import './lastValueFrom'
//import './share'
//import './merge'
//import './catchError'
//import './throwError'
//import './filter'
//import './throwIfEmpty'