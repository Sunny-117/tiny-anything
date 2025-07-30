'use strict';
//Axios 构造函数文件

//引入工具
var utils = require('../utils');
//引入构建 URL 工具
var buildURL = require('../helpers/buildURL');
//引入拦截器管理构造函数
var InterceptorManager = require('./InterceptorManager');
//引入发送请求的函数
var dispatchRequest = require('./dispatchRequest');
//获取合并配置的函数
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 * 创建 Axios 构造函数
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
    //实例对象上的 defaults 属性为配置对象
    this.defaults = instanceConfig;
    //实例对象上有 interceptors 属性用来设置请求和响应拦截器
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    };
}

/**
 * Dispatch a request
 * 发送请求的方法.  原型上配置, 则实例对象就可以调用 request 方法发送请求
 */
Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    /**
     * axios('http://www.baidu.com', {header:{}})
     */
    if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
    } else {
        config = config || {};
    }
    //将默认配置与用户调用时传入的配置进行合并
    config = mergeConfig(this.defaults, config);

    // Set config.method
    // 设定请求方法
    if (config.method) {
        config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
    } else {
        config.method = 'get';
    }

    // Hook up interceptors middleware
    // 创建拦截器中间件  第一个参数用来发送请求, 第二个为 undefined 用来补位
    var chain = [dispatchRequest, undefined];
    // 创建一个成功的 promise 且成功的值为合并后的请求配置
    var promise = Promise.resolve(config);//  promise 成功的Promise
    // 遍历实例对象的请求拦截器,
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        //将请求拦截器压入数组的最前面
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        //将相应拦截器压入数组的最尾部
        chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    //如果链条长度不为 0
    while (chain.length) {
        //依次取出 chain 的回调函数, 并执行
        promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
};

Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods  axios.get  axios.post axios.put

utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function (url, config) {
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url
        }));
    };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function (url, data, config) {
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url,
            data: data
        }));
    };
});

module.exports = Axios;
