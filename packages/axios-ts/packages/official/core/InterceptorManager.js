'use strict';
// 拦截器管理器构造函数
var utils = require('../utils');

//声明构造函数  
//axios.interceptors.request.use
//axios.interceptors.response.use
function InterceptorManager() {
  //创建一个属性
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 * 添加拦截器到栈中, 以待后续执行, 返回拦截器的编号(编号为当前拦截器综合数减一)
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 * 从拦截器数组中移除指定 ID 的拦截器
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 * 创建拦截器对象遍历方法
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
