'use strict';
// axios 配置文件
//引入工具
var utils = require('./utils');
//引入统一化头信息的工具函数
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
//声明默认的请求体类型
var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

//设置 mime 类型
function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
    }
}

//获取默认的适配器
function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        //引入用于发送 AJAX 请求的适配器
        adapter = require('./adapters/xhr');
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        //引入用于在 Node 端发送HTTP请求的适配器
        adapter = require('./adapters/http');
    }
    return adapter;
}

//默认的配置项
var defaults = {
    //适配器
    adapter: getDefaultAdapter(),
    //请求数据转换函数
    transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');
        if (utils.isFormData(data) ||
            utils.isArrayBuffer(data) ||
            utils.isBuffer(data) ||
            utils.isStream(data) ||
            utils.isFile(data) ||
            utils.isBlob(data)
        ) {
            return data;
        }
        if (utils.isArrayBufferView(data)) {
            return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
            return data.toString();
        }
        if (utils.isObject(data)) {
            setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
            return JSON.stringify(data);
        }
        return data;
    }],
    //响应数据转换函数
    transformResponse: [function transformResponse(data) {
        /*eslint no-param-reassign:0*/
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) { /* Ignore */
            }
        }
        return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     * 超时时间设置
     */
    timeout: 0,

    //防止攻击的检测字符串
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    //请求为成功的条件
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    }
};

//添加默认的请求头信息
defaults.headers = {
    common: {
        'Accept': 'application/json, text/plain, */*'
    }
};
//为 default 添加头信息属性  default.headers.get  default.headers.delete
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
});
//为 default 添加头信息属性  default.headers.post  default.headers.put
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;
