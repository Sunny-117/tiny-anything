'use strict';
//检测参数是否为 取消对象
module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};
