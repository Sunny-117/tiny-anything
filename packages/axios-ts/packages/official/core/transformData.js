'use strict';
// 结果数据格式转化函数
//引入工具
var utils = require('../utils');

/**
 * Transform the data for a request or a response
 * 暴露函数 对请求和响应数据进行转换
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};
