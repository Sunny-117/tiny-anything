'use strict';
// axios 入口文件
//引入工具
var utils = require('./utils');
//引入绑定函数  创建函数
var bind = require('./helpers/bind');// 创建函数的
//引入 Axios 主文件
var Axios = require('./core/Axios');
// 引入合并配置的函数
var mergeConfig = require('./core/mergeConfig');
// 导入默认配置
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 * 创建一个 Axios 的实例对象
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
    //创建一个实例对象 context 可以调用 get  post put delete request
    var context = new Axios(defaultConfig);// context 不能当函数使用  

    // 将 request 方法的 this 指向 context 并返回新函数  instance 可以用作函数使用, 且返回的是一个 promise 对象
    var instance = bind(Axios.prototype.request, context);// instance 与 Axios.prototype.request 代码一致
    // instance({method:'get'});  instance.get() .post()
    // 将 Axios.prototype 和实例对象的方法都添加到 instance 函数身上
    // extend可以将对象的方法进行复制，将显示原型上的方法都放到instance身上， instance此时只是一个函数
    utils.extend(instance, Axios.prototype, context);// instance.get instance.post ...
    // instance()  instance.get()
    // 将实例对象的方法和属性扩展到 instance 函数身上
    utils.extend(instance, context);

    return instance;
}
// axios.interceptors

// Create the default instance to be exported
// 通过配置创建 axios 函数
var axios = createInstance(defaults);


// Expose Axios class to allow class inheritance
// axios 添加 Axios 属性, 属性值为构造函数对象  axios.CancelToken = CancelToken    new axios.Axios();
axios.Axios = Axios;

// Factory for creating new instances
// 工厂函数  用来返回创建实例对象的函数
axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

//简单实现全局暴露 axios
window.axios = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

