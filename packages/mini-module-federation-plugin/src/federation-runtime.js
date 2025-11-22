/**
 * Mini Module Federation Runtime
 * 简化版模块联邦运行时
 */

// 全局存储
window.__FEDERATION__ = window.__FEDERATION__ || {
  // 存储所有联邦的暴露模块
  // 格式: { federationName: { './modulePath': moduleFactory } }
  modules: {},
  
  // 存储共享模块（singleton）
  // 格式: { packageName: module }
  shared: {},
  
  // 存储远程入口加载状态
  // 格式: { url: Promise }
  remoteEntries: {},
};

/**
 * 注册联邦暴露的模块
 * @param {string} name - 联邦名称
 * @param {Object} modules - 模块映射 { './path': factory }
 */
window.__FEDERATION__.register = function(name, modules) {
  console.log(`[Federation] Registering federation: ${name}`, modules);
  window.__FEDERATION__.modules[name] = modules;
};

/**
 * 获取本地模块
 * @param {string} name - 联邦名称
 * @param {string} modulePath - 模块路径
 * @returns {any} 模块导出
 */
window.__FEDERATION__.getLocal = function(name, modulePath) {
  const federation = window.__FEDERATION__.modules[name];
  if (!federation) {
    throw new Error(`[Federation] Federation "${name}" not found`);
  }
  
  const moduleFactory = federation[modulePath];
  if (!moduleFactory) {
    throw new Error(`[Federation] Module "${modulePath}" not found in federation "${name}"`);
  }
  
  // 执行模块工厂函数获取模块
  return moduleFactory();
};

/**
 * 加载远程入口文件
 * @param {string} url - 远程入口 URL
 * @returns {Promise<void>}
 */
window.__FEDERATION__.loadRemoteEntry = function(url) {
  // 如果已经加载过，返回缓存的 Promise
  if (window.__FEDERATION__.remoteEntries[url]) {
    return window.__FEDERATION__.remoteEntries[url];
  }
  
  // 创建加载 Promise
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      console.log(`[Federation] Remote entry loaded: ${url}`);
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error(`[Federation] Failed to load remote entry: ${url}`));
    };
    
    document.head.appendChild(script);
  });
  
  // 缓存 Promise
  window.__FEDERATION__.remoteEntries[url] = promise;
  return promise;
};

/**
 * 获取远程模块
 * @param {string} remoteName - 远程联邦名称
 * @param {string} remoteUrl - 远程入口 URL
 * @param {string} modulePath - 模块路径
 * @returns {Promise<any>} 模块导出
 */
window.__FEDERATION__.getRemote = async function(remoteName, remoteUrl, modulePath) {
  // 先加载远程入口
  await window.__FEDERATION__.loadRemoteEntry(remoteUrl);
  
  // 从全局获取远程模块
  return window.__FEDERATION__.getLocal(remoteName, modulePath);
};

/**
 * 注册共享模块
 * @param {string} packageName - 包名
 * @param {any} module - 模块
 */
window.__FEDERATION__.registerShared = function(packageName, module) {
  if (!window.__FEDERATION__.shared[packageName]) {
    console.log(`[Federation] Registering shared module: ${packageName}`);
    window.__FEDERATION__.shared[packageName] = module;
  } else {
    console.log(`[Federation] Shared module already exists (singleton): ${packageName}`);
  }
};

/**
 * 获取共享模块
 * @param {string} packageName - 包名
 * @returns {any} 模块
 */
window.__FEDERATION__.getShared = function(packageName) {
  return window.__FEDERATION__.shared[packageName];
};

/**
 * 检查共享模块是否存在
 * @param {string} packageName - 包名
 * @returns {boolean}
 */
window.__FEDERATION__.hasShared = function(packageName) {
  return !!window.__FEDERATION__.shared[packageName];
};

console.log('[Federation] Runtime initialized');

