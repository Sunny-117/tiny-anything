import {
  lastValueFrom,
  share,
  mergeMap,
  filter,
  merge,
  Subject,
  takeUntil,
  throwIfEmpty,
} from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { getUrlFromOptions, getInitFromOptions } from "./utils";
class Http {
  cancelRequests = new Subject();
  cancel(requestId) {
    this.cancelRequests.next(requestId);
  }
  request(options) {
    const url = getUrlFromOptions(options);
    const init = getInitFromOptions(options);
    const fetchStream = fromFetch(url, init).pipe(share());
    const successStream = fetchStream.pipe(
      filter((response) => response.ok),
      mergeMap(async (response) => ({
        data: await response.json(),
        status: response.status,
      }))
    );
    const failStream = fetchStream.pipe(
      filter((response) => !response.ok),
      mergeMap(async (response) =>
        Promise.reject({
          error: await response.json(),
          status: response.status,
        })
      )
    );
    const mergedStream = merge(successStream, failStream).pipe(
      takeUntil(
        this.cancelRequests.pipe(
          filter((requestId) => options.requestId === requestId)
        )
      ),
      throwIfEmpty(() => ({
        type: "cancel",
        cancelled: true,
        data: null,
        status: -1,
        statusText: "请求被取消",
        config: options,
      }))
    );
    return lastValueFrom(mergedStream);
  }
  post(url, data) {
    return this.request({
      method: "POST",
      url,
      data,
      headers: { "Content-Type": "application/json" },
    });
  }
  delete(url, params, requestId) {
    return this.request({
      method: "DELETE",
      url,
      params,
      requestId,
    });
  }
  put(url, data, requestId) {
    return this.request({
      method: "PUT",
      url,
      data,
      requestId,
      headers: { "Content-Type": "application/json" },
    });
  }
  get(url, params, requestId) {
    return this.request({
      method: "GET",
      url,
      params,
      requestId,
    });
  }
}
export const http = new Http();
