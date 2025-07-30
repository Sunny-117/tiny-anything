'use strict';
// 取消请求的构造函数
var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 * 构造函数   new axios.CancelToken
 * @class
 * @param {Function} executor The executor function. 执行器函数必须是一个函数
 */
function CancelToken(executor) {
    //执行器函数必须是一个函数
    if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
    }

    //声明一个变量
    var resolvePromise; //  resolvePromise()
    //实例对象身上添加 promise 属性
    this.promise = new Promise(function promiseExecutor(resolve) {
        //将修改 promise 对象成功状态的函数暴露出去
        resolvePromise = resolve;
    });
    // token 指向当前的实例对象
    var token = this;
    //将修改 promise 状态的函数暴露出去, 通过 cancel = c 可以将函数赋值给 cancel
    executor(function cancel(message) {
        if (token.reason) {
            // Cancellation has already been requested
            return;
        }

        token.reason = new Cancel(message);
        resolvePromise(token.reason);
    });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
        throw this.reason;
    }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
        cancel = c;
    });
    return {
        token: token,
        cancel: cancel
    };
};

module.exports = CancelToken;
