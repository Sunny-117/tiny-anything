# Mini Module Federation Plugin

一个简化版的 Webpack Module Federation 实现（Happy Path）- 教学演示版本。

## 📦 功能特性

- ✅ **Exposes**: 暴露模块给其他应用使用
- ✅ **Remotes**: 加载远程应用的模块
- ✅ **Shared**: 共享依赖（singleton 模式）
- ✅ **双向调用**: Provider 和 Consumer 可以互相调用
- ✅ **Runtime**: 独立的运行时系统

## ⚠️ 当前状态

本项目是一个**教学演示项目**，展示了 Module Federation 的核心概念和实现思路。

**已完成**:
- ✅ Runtime 运行时代码（完整实现）
- ✅ ModuleFederationPlugin 插件（完整实现）
- ✅ Exposes、Remotes、Shared 功能
- ✅ 双向模块调用演示
- ✅ 完整的构建和运行流程

**技术实现**:
- 使用 Dynamic Import 实现模块懒加载
- 使用 Webpack Externals 实现远程模块加载
- 使用 Webpack Hooks 在正确的时机修改配置
- 生成 Federation Entry 文件进行模块注册

## 🏗️ 项目结构

```
mini-module-federation-plugin/
├── src/
│   ├── federation-runtime.js      # 运行时核心代码
│   └── ModuleFederationPlugin.js  # Webpack 插件
├── app/
│   ├── home/                      # Home 应用（端口 8080）
│   │   ├── src/
│   │   │   ├── index.js          # 入口文件
│   │   │   ├── bootstrap.js      # 应用启动
│   │   │   └── now.js            # 暴露的模块：显示当前时间
│   │   └── webpack.config.js
│   └── active/                    # Active 应用（端口 3000）
│       ├── src/
│       │   ├── index.js          # 入口文件
│       │   ├── bootstrap.js      # 应用启动
│       │   ├── news.js           # 暴露的模块：新闻列表
│       │   └── get.js            # 暴露的模块：工具函数
│       └── webpack.config.js
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装 home 应用依赖
cd app/home
pnpm install

# 安装 active 应用依赖
cd ../active
pnpm install
```

### 2. 启动应用

**启动 Active 应用（端口 3000）：**

```bash
cd app/active
pnpm dev
```

**启动 Home 应用（端口 8080）：**

```bash
cd app/home
pnpm dev
```

### 3. 访问应用

- **Home 应用**: http://localhost:8080
  - 显示当前时间（本地模块 `./now`）
  - 加载并显示 Active 应用的新闻列表（远程模块 `active/news`）
  - 使用 Active 应用的工具函数（远程模块 `active/get`）

- **Active 应用**: http://localhost:3000
  - 显示新闻列表（本地模块 `./news`）
  - 加载并显示 Home 应用的当前时间（远程模块 `home/now`）

### 4. 验证功能

打开浏览器控制台（F12），你应该能看到：

1. **模块加载日志**: 显示远程模块的加载过程
2. **共享依赖**: jQuery 在两个应用间共享（singleton 模式）
3. **双向调用**: Home 调用 Active 的模块，Active 也调用 Home 的模块
4. **动态内容**: 两个应用都能正确显示来自对方的内容

## 💡 使用示例

### 配置 Module Federation

**Home 应用配置** (`app/home/webpack.config.js`):

```javascript
const ModuleFederationPlugin = require('../../src/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'home',
      filename: 'home-entry.js',
      exposes: {
        './now': './src/now.js',  // 暴露时间模块
      },
      remotes: {
        active: 'active@http://localhost:3000/active-entry.js',  // 引用 active 应用
      },
      shared: {
        jquery: {
          singleton: true,  // 全局单例
        },
      },
    }),
  ],
};
```

**Active 应用配置** (`app/active/webpack.config.js`):

```javascript
const ModuleFederationPlugin = require('../../src/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'active',
      filename: 'active-entry.js',
      exposes: {
        './news': './src/news.js',  // 暴露新闻模块
        './get': './src/get.js',    // 暴露工具函数
      },
      remotes: {
        home: 'home@http://localhost:8080/home-entry.js',  // 引用 home 应用
      },
      shared: {
        jquery: {
          singleton: true,
        },
      },
    }),
  ],
};
```

### 使用远程模块

**在 Home 应用中使用 Active 的模块：**

```javascript
// app/home/src/bootstrap.js
import news from 'active/news';  // 导入远程模块
import { getName, getPrefix } from 'active/get';

// 使用远程模块
news($('<div>').appendTo(document.body));
console.log(getName(), getPrefix());
```

**在 Active 应用中使用 Home 的模块：**

```javascript
// app/active/src/bootstrap.js
import now from 'home/now';  // 导入远程模块

// 使用远程模块
now($('<div>').appendTo(document.body));
```

## 🔧 核心实现

### 1. Runtime (federation-runtime.js)

运行时提供以下核心功能：

- `register(name, modules)` - 注册联邦模块
- `getLocal(name, modulePath)` - 获取本地模块
- `getRemote(remoteName, remoteUrl, modulePath)` - 获取远程模块
- `loadRemoteEntry(url)` - 加载远程入口文件
- `registerShared(packageName, module)` - 注册共享模块
- `getShared(packageName)` - 获取共享模块

### 2. Plugin (ModuleFederationPlugin.js)

插件在构建时：

1. **注入 Runtime**: 将 runtime 代码注入到所有入口
2. **处理 Exposes**: 为暴露的模块创建独立的入口文件
3. **处理 Remotes**: 使用 webpack externals 配置远程模块加载

## 📝 注意事项

这是一个 **Happy Path** 实现，仅用于学习和演示目的：

- ✅ 支持基本的模块暴露和远程加载
- ✅ 支持双向调用
- ✅ 支持 shared singleton
- ❌ 不支持版本控制
- ❌ 不支持复杂的 shared 策略
- ❌ 不支持 SSR
- ❌ 错误处理较简单

## 🎯 与 Webpack Module Federation 的区别

| 特性 | Webpack MF | Mini MF |
|------|-----------|---------|
| 基本功能 | ✅ | ✅ |
| 版本控制 | ✅ | ❌ |
| 复杂 Shared 策略 | ✅ | ❌ |
| SSR 支持 | ✅ | ❌ |
| 生产优化 | ✅ | ❌ |

## 📚 项目文档

### 核心文档
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - 详细的实现原理和架构说明
- **[USAGE.md](./USAGE.md)** - 使用指南和最佳实践
- **[SUMMARY.md](./SUMMARY.md)** - 项目总结和学习价值

### 核心代码
- **[src/federation-runtime.js](./src/federation-runtime.js)** - Runtime 运行时实现
- **[src/ModuleFederationPlugin.js](./src/ModuleFederationPlugin.js)** - Plugin 插件实现（未完成）

### 示例应用
- **[app/home](./app/home)** - Home 应用示例
- **[app/active](./app/active)** - Active 应用示例

## 🔗 外部资源

- [Webpack Module Federation 官方文档](https://webpack.js.org/concepts/module-federation/)
- [Module Federation 示例](https://github.com/module-federation/module-federation-examples)
- [微前端架构](https://micro-frontends.org/)

# 实现思路
# Module Federation 实现原理详解

## 🎯 核心概念

Module Federation 允许多个独立的 webpack 构建形成一个应用。关键概念：

1. **Host (Consumer)**: 加载远程模块的应用
2. **Remote (Provider)**: 暴露模块的应用
3. **Shared**: 在多个应用间共享的依赖
4. **Runtime**: 协调模块加载的运行时系统

## 🏗️ 实现架构

### 1. Runtime 层 (`federation-runtime.js`)

Runtime 是整个系统的核心，提供：

```javascript
window.__FEDERATION__ = {
  // 存储已注册的容器（应用）
  containers: {},
  
  // 存储共享依赖
  shared: {},
  
  // 缓存已加载的远程入口
  remoteCache: {},
  
  // 注册本地暴露的模块
  register(name, modules) {
    this.containers[name] = modules;
  },
  
  // 获取本地模块
  getLocal(name, modulePath) {
    const container = this.containers[name];
    if (!container || !container[modulePath]) {
      throw new Error(`Module ${modulePath} not found in ${name}`);
    }
    return container[modulePath]();
  },
  
  // 加载远程模块
  async getRemote(name, url, modulePath) {
    // 1. 加载远程入口文件
    await this.loadRemoteEntry(name, url);
    // 2. 获取模块
    return this.getLocal(name, modulePath);
  },
  
  // 加载远程入口文件（通过 script 标签）
  loadRemoteEntry(name, url) {
    if (this.remoteCache[name]) {
      return this.remoteCache[name];
    }
    
    this.remoteCache[name] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(script);
    });
    
    return this.remoteCache[name];
  },
  
  // 注册共享依赖
  registerShared(name, module) {
    if (!this.shared[name]) {
      this.shared[name] = module;
    }
  },
  
  // 获取共享依赖
  getShared(name) {
    return this.shared[name];
  }
};
```

### 2. Plugin 层 (`ModuleFederationPlugin.js`)

Plugin 负责在构建时：

#### 2.1 处理 Exposes（暴露模块）

生成一个入口文件，将所有暴露的模块注册到 runtime：

```javascript
// 生成的入口文件示例
import * as module1 from './src/news.js';
import * as module2 from './src/get.js';

const modules = {
  './news': () => module1,
  './get': () => module2
};

window.__FEDERATION__.register('active', modules);
```

#### 2.2 处理 Remotes（远程模块）

使用 webpack externals 机制，将远程模块标记为外部依赖：

```javascript
// webpack 配置
externals: {
  'active/news': 'promise new Promise(resolve => {
    window.__FEDERATION__.getRemote("active", "http://localhost:3000/active-entry.js", "./news")
      .then(module => resolve(() => module))
  })'
}
```

当代码中 `import news from 'active/news'` 时，webpack 会：
1. 不打包这个模块
2. 在运行时执行 Promise
3. 通过 runtime 加载远程模块

#### 2.3 处理 Shared（共享依赖）

在应用启动时注册共享依赖：

```javascript
import $ from 'jquery';
window.__FEDERATION__.registerShared('jquery', $);
```

## 🔄 运行流程

### 场景：Home 应用加载 Active 应用的 news 模块

1. **构建阶段**:
   - Active 应用生成 `active-entry.js`（包含暴露的模块）
   - Home 应用将 `active/news` 配置为 external

2. **运行阶段**:
   ```javascript
   // Home 应用代码
   import news from 'active/news';  // webpack 转换为 external
   
   // 实际执行
   const news = await window.__FEDERATION__.getRemote(
     'active',
     'http://localhost:3000/active-entry.js',
     './news'
   );
   ```

3. **Runtime 处理**:
   - 检查是否已加载 `active-entry.js`
   - 如果没有，创建 `<script>` 标签加载
   - `active-entry.js` 执行后调用 `register('active', modules)`
   - 从注册的模块中返回 `./news`

## 📝 关键实现细节

### 1. 为什么需要 Runtime？

- 协调多个应用的模块注册和加载
- 管理共享依赖的单例
- 处理异步加载和缓存

### 2. 为什么使用 Webpack Externals？

- 告诉 webpack 某些模块在运行时才可用
- 避免将远程模块打包到本地
- 支持动态加载

### 3. Shared Singleton 如何工作？

```javascript
// 第一个应用注册
window.__FEDERATION__.registerShared('jquery', jqueryInstance);

// 第二个应用获取（复用同一个实例）
const $ = window.__FEDERATION__.getShared('jquery');
```
