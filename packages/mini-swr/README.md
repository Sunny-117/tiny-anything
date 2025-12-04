# 简易版 SWR 实现

基于源码分析实现的简易版 SWR，包含核心功能。

## 实现的功能

1. ✅ 基本取数功能
2. ✅ 缓存机制
3. ✅ 条件取数（key 为 null 时不取数）
4. ✅ 依赖取数（通过 try/catch 和重渲染实现）
5. ✅ 全局配置（SWRConfig）
6. ✅ 乐观更新（mutate）
7. ✅ 自定义 fetcher
8. ✅ 错误处理
9. ✅ 加载状态管理

## 核心实现原理

### 1. 缓存机制
使用 Map 存储全局缓存，key 为请求标识，value 为数据。

### 2. 依赖取数
通过 try/catch 捕获 key 函数执行错误，当依赖未就绪时返回 null，等待重渲染后重试。

### 3. 状态管理
使用 useReducer 统一管理 data、error、isValidating 状态，避免多次渲染。

### 4. 全局配置
通过 Context API 实现配置的跨组件传递和合并。

### 5. 监听器模式
使用发布订阅模式，当数据更新时通知所有使用相同 key 的组件。

## 与官方 SWR 的对比

本实现包含了 SWR 的核心功能，但为了简化，省略了：
- Suspense 支持
- Focus 重新取数
- 自动重试机制
- 请求去重
- requestIdleCallback 优化
- SSR 支持
