'use strict';
//发送请求的函数文件

//引入工具
var utils = require('../utils');
//引入数据转化工具
var transformData = require('./transformData');
//引入检测是否为取消对象的函数
var isCancel = require('../cancel/isCancel');
//引入请求的默认配置
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 * 抛出一个 Cancel 类型的错误, 如果这个请求已经发送出去
 */
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}

/**
 * 使用配置好的适配器发送一个请求
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
    //如果被取消的请求被发送出去, 抛出错误
    throwIfCancellationRequested(config);

    // Ensure headers exist
    //确保头信息存在
    config.headers = config.headers || {};

    // 对请求数据进行初始化转化
    config.data = transformData(
        config.data,
        config.headers,
        config.transformRequest
    );

    // 合并一切其他头信息的配置项
    config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},// 单独为请求的类型进行头信息设置
        config.headers
    );

    //将配置项中关于方法的配置项全部移除
    utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
            delete config.headers[method];
        }
    );

    //获取适配器对象 http  xhr
    var adapter = config.adapter || defaults.adapter;

    //发送请求， 返回请求后 promise 对象  ajax HTTP
    return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // 对响应结果进行处理
        response.data = transformData(
            response.data,
            response.headers,
            config.transformResponse
        );
        //设置 promise 成功的值为 响应结果
        return response;// 是成功的promise
    }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
            throwIfCancellationRequested(config);

            // Transform response data
            if (reason && reason.response) {
                reason.response.data = transformData(
                    reason.response.data,
                    reason.response.headers,
                    config.transformResponse
                );
            }
        }
        //设置 promise 为失败, 失败的值为错误信息
        return Promise.reject(reason);
    });
};
