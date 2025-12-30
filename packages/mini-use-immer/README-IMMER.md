# 迷你 Immer 实现

这是一个简化版的 Immer 核心 API 实现，用于演示 Immer 的工作原理。

## 📁 文件结构

```
src/
├── mini-immer.ts    # 核心 produce 函数实现
├── use-immer.ts     # React Hook 封装
└── App.tsx          # 演示示例
```

## 🎯 核心原理

### 1. Proxy 代理拦截

使用 `Proxy` 拦截对象的所有读写操作：

```typescript
const draft = new Proxy(baseState, {
  get(target, prop) { /* 读取拦截 */ },
  set(target, prop, value) { /* 写入拦截 */ },
  deleteProperty(target, prop) { /* 删除拦截 */ }
});
```

### 2. 懒拷贝（Lazy Copy）

只在**第一次修改**时才创建浅拷贝：

```typescript
function prepareCopy(state) {
  if (!state.copy) {
    state.copy = Array.isArray(state.base)
      ? [...state.base]
      : { ...state.base };
  }
}
```

### 3. 结构共享（Structural Sharing）

未修改的部分完全复用原对象：

```typescript
function finalize(state) {
  if (!state.modified) {
    return state.base;  // 直接返回原对象（===）
  }
  return state.copy;    // 返回修改后的拷贝
}
```

### 4. 递归代理

对嵌套对象递归创建代理，实现深层修改：

```typescript
get(target, prop) {
  const value = source[prop];
  if (isProxyable(value)) {
    return createProxy(childState);  // 递归代理
  }
  return value;
}
```

## 🚀 使用示例

### 基础用法

```typescript
import { produce } from './mini-immer';

const baseState = { count: 0, user: { name: 'Alice' } };

const nextState = produce(baseState, draft => {
  draft.count++;
  draft.user.name = 'Bob';
});

console.log(baseState.count);      // 0 (原对象不变)
console.log(nextState.count);      // 1
console.log(baseState === nextState); // false
```

### React Hook 用法

```typescript
import { useImmer } from './use-immer';

function Counter() {
  const [state, update] = useImmer({ count: 0 });
  
  return (
    <button onClick={() => update(draft => {
      draft.count++;  // 可变写法
    })}>
      Count: {state.count}
    </button>
  );
}
```

## 🔍 工作流程

```
1. 创建 Draft (Proxy)
   ↓
2. 执行 recipe 函数
   ↓
3. 拦截写操作 → Lazy Copy
   ↓
4. 标记修改路径
   ↓
5. Finalize 生成新状态
   ↓
6. 结构共享 + 冻结（可选）
```

## ⚡ 性能优化

1. **懒拷贝**：只复制被修改的路径
2. **结构共享**：未修改部分完全复用（`===`）
3. **局部更新**：React 可以跳过未变化的组件

## 🎓 核心数据结构

```typescript
interface ProxyState {
  base: any;           // 原始对象
  copy: any;           // 浅拷贝（懒创建）
  modified: boolean;   // 是否被修改
  parent?: ProxyState; // 父节点
  key?: string;        // 在父节点中的 key
}
```

## ⚠️ 限制说明

这是一个简化实现，与真实 Immer 的区别：

- ✅ 支持：对象、数组、嵌套结构
- ✅ 支持：懒拷贝、结构共享
- ❌ 不支持：Map、Set、Date 等特殊对象
- ❌ 不支持：Patch 生成
- ❌ 不支持：异步 recipe

## 🎯 关键概念

### 可变写法 → 不可变结果

```typescript
// 看起来是可变的
update(draft => {
  draft.count++;
});

// 实际上是不可变的
setState(prev => ({ ...prev, count: prev.count + 1 }));
```

### 为什么不能异步？

```typescript
// ❌ 错误
update(async draft => {
  await fetch();
  draft.count++;  // Proxy 已失效
});

// ✅ 正确
const data = await fetch();
update(draft => {
  draft.count = data.count;
});
```

## 📊 对比

| 特性 | useState | useImmer |
|------|----------|----------|
| 写法 | 手写不可变 | 可变写法 |
| 易错性 | 容易忘记展开 | 安全 |
| 性能 | 全量拷贝 | 局部拷贝 |
| 心智负担 | 高 | 低 |

## 🎉 运行项目

```bash
npm install
npm run dev
```

打开浏览器查看演示效果！
