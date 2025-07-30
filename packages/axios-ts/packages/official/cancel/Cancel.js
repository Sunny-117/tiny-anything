'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 * 构造函数, 用来创建取消时的错误对象
 * @class
 * @param {string=} message The message.
 *
 */
function Cancel(message) {
  this.message = message;
}
//原型添加 toString 方法
Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};
//原型添加 __CANCEL__ 属性
Cancel.prototype.__CANCEL__ = true; // 判断对象是否是Cancel实例

module.exports = Cancel;
