# Minimal lit-html

一个最小化的 lit-html 实现

## 特性

- ✅ `html` 模板标签函数
- ✅ `render` 函数用于渲染到 DOM
- ✅ 文本插值更新
- ✅ DOM 节点复用（仅更新变化的插值）
- ✅ 模板缓存和实例管理

## 安装

```bash
npm install
```

## 构建

```bash
npm run build
```

## 测试

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行属性测试
npm run test:property

# 监听模式
npm run test:watch
```

## 运行 Demo

```bash
npm run demo
```

然后在浏览器中打开 http://localhost:3000/

## 使用示例

```typescript
import { html, render } from 'minimal-lit-html';

// 定义模板
const view = (name: string) => html`<div>Hello ${name}</div>`;

// 获取容器
const container = document.getElementById('app')!;

// 首次渲染
render(view('Steve'), container);
// DOM: <div>Hello Steve</div>

// 更新渲染（仅更新文本节点）
render(view('Kevin'), container);
// DOM: <div>Hello Kevin</div>
```

## API

### `html`

标签模板函数，用于创建 TemplateResult。

```typescript
function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): TemplateResult
```

### `render`

将 TemplateResult 渲染到容器。

```typescript
function render(
  result: TemplateResult,
  container: Element | DocumentFragment
): void
```

## 架构

- **html.ts**: html 标签函数和 TemplateResult
- **template.ts**: Template 类和模板解析
- **part.ts**: Part 接口和 TextPart 实现
- **render.ts**: render 函数和实例管理
- **index.ts**: 公共 API 导出

## 限制（明确不支持）

- ❌ 事件绑定
- ❌ Attribute / Property binding
- ❌ 指令（repeat / when / unsafeHTML）
- ❌ SVG / SSR
- ❌ 跨容器 diff

## 测试覆盖

- 30 个测试用例
- 包含单元测试和基于属性的测试
- 使用 fast-check 进行属性测试

## License

MIT
