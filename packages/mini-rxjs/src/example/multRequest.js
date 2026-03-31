// 多请求 并发请求

import { from, mergeMap } from "rxjs";

/**
 * 实现一个并发请求的函数， request(urls, concurrent)
 * 1. 要求有最大并发数
 * 2. 当一个请求结束的时候，可以开启排除中的新的请求
 * 3. 最后打印结果的时候顺序不能乱， 要和urls中的顺序保持一致
 */
const urls = ["/user/1", "/user/2", "/user/3"];

const start = Date.now();

function fetchData(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(url);
    }, 3000);
  });
}

function multiRequest(urls, concurrent) {
  from(urls)
    .pipe(mergeMap(fetchData, concurrent))
    .subscribe((val) => {
      console.log(`耗时 ${parseInt((Date.now() - start) / 1000)}s`);
      console.log(val);
    });
}

multiRequest(urls, 2);
