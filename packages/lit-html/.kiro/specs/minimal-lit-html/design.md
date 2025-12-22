# 设计文档

## 概述

本设计实现了一个最小化的 lit-html 库，用于高性能的 HTML 模板渲染。核心思想是将模板结构（静态字符串）与数据（动态值）分离，首次渲染时构建完整 DOM，后续更新时仅修改变化的插值节点。

### 核心设计原则

1. **结构与数据分离**：模板字符串数组保持不变，仅值发生变化
2. **最小化 DOM 操作**：使用 Object.is() 比较，仅更新变化的节点
3. **模板缓存**：相同的模板结构只解析一次
4. **实例复用**：每个容器维护一个模板实例，支持高效更新

## 架构

### 模块结构

```
src/
├── html.ts          # html 标签函数和 TemplateResult
├── template.ts      # Template 类和模板解析
├── part.ts          # Part 接口和 TextPart 实现
├── render.ts        # render 函数和实例管理
└── index.ts         # 公共 API 导出
```

### 数据流

```
html`<div>${value}</div>`
    ↓
TemplateResult { strings, values }
    ↓
render(result, container)
    ↓
首次渲染：Template → TemplateInstance → DOM
    ↓
后续渲染：TemplateInstance.update(values)
    ↓
Part.setValue(newValue) → 更新 Text 节点
```

## 组件和接口

### 1. TemplateResult

表示模板标签函数的返回值，包含静态结构和动态值。

```typescript
interface TemplateResult {
  readonly strings: TemplateStringsArray;
  readonly values: readonly unknown[];
}
```

**职责：**
- 存储模板字符串数组（静态结构）
- 存储插值数组（动态数据）
- 作为 html 函数和 render 函数之间的数据传递对象

**不变式：**
- `strings.length === values.length + 1`
- 对象逻辑上不可变

### 2. html 函数

标签模板函数，用于创建 TemplateResult。

```typescript
function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): TemplateResult
```

**实现：**
```typescript
export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): TemplateResult {
  return {
    strings,
    values
  };
}
```

**关键点：**
- 不执行任何 DOM 操作
- 不解析模板
- 仅创建数据对象
- JavaScript 引擎保证相同模板字面量的 strings 引用相同

### 3. Template

表示已解析的模板结构，包含 HTMLTemplateElement 和标记位置。

```typescript
class Template {
  readonly strings: TemplateStringsArray;
  readonly element: HTMLTemplateElement;
  
  constructor(strings: TemplateStringsArray) {
    this.strings = strings;
    this.element = this.createTemplate(strings);
  }
  
  private createTemplate(strings: TemplateStringsArray): HTMLTemplateElement {
    // 实现细节见下文
  }
}
```

**职责：**
- 将 strings 数组转换为 HTML 字符串
- 在插值位置插入标记注释节点
- 创建 HTMLTemplateElement 用于克隆

**模板生成算法：**

```typescript
private createTemplate(strings: TemplateStringsArray): HTMLTemplateElement {
  // 1. 拼接 HTML，在插值位置插入注释标记
  let html = strings[0];
  for (let i = 1; i < strings.length; i++) {
    html += `<!--lit-marker-->` + strings[i];
  }
  
  // 2. 创建 template 元素
  const template = document.createElement('template');
  template.innerHTML = html;
  
  return template;
}
```

**标记格式：**
- 使用注释节点：`<!--lit-marker-->`
- 每个 `${}` 对应一个标记
- 标记数量 = values.length

### 4. Part 接口和 TextPart

Part 是动态插入点的抽象，TextPart 是文本插值的具体实现。

```typescript
interface Part {
  setValue(value: unknown): void;
}

class TextPart implements Part {
  private node: Text;
  private value: unknown;
  
  constructor(node: Text) {
    this.node = node;
    this.value = undefined;
  }
  
  setValue(value: unknown): void {
    // 实现细节见下文
  }
}
```

**TextPart.setValue 实现：**

```typescript
setValue(value: unknown): void {
  // 1. 规范化值
  const normalized = value ?? '';
  
  // 2. 比较新旧值
  if (Object.is(this.value, normalized)) {
    return; // 值未变化，跳过更新
  }
  
  // 3. 更新 DOM
  this.node.textContent = String(normalized);
  this.value = normalized;
}
```

**关键设计决策：**
- 使用 `Object.is()` 而非 `===`，正确处理 NaN 和 ±0
- null/undefined 转换为空字符串
- 缓存当前值以避免不必要的 DOM 操作

### 5. TemplateInstance

表示模板的一个渲染实例，维护 Parts 数组和当前状态。

```typescript
class TemplateInstance {
  readonly template: Template;
  readonly parts: Part[];
  private fragment: DocumentFragment;
  
  constructor(template: Template) {
    this.template = template;
    this.fragment = template.element.content.cloneNode(true) as DocumentFragment;
    this.parts = this.createParts(this.fragment);
  }
  
  private createParts(fragment: DocumentFragment): Part[] {
    // 实现细节见下文
  }
  
  update(values: readonly unknown[]): void {
    // 实现细节见下文
  }
  
  appendTo(container: Element | DocumentFragment): void {
    container.appendChild(this.fragment);
  }
}
```

**createParts 实现：**

```typescript
private createParts(fragment: DocumentFragment): Part[] {
  const parts: Part[] = [];
  const walker = document.createTreeWalker(
    fragment,
    NodeFilter.SHOW_COMMENT,
    null
  );
  
  let node: Comment | null;
  while ((node = walker.nextNode() as Comment | null)) {
    if (node.textContent === 'lit-marker') {
      // 创建文本节点替换标记
      const textNode = document.createTextNode('');
      node.parentNode!.replaceChild(textNode, node);
      parts.push(new TextPart(textNode));
    }
  }
  
  return parts;
}
```

**update 实现：**

```typescript
update(values: readonly unknown[]): void {
  if (values.length !== this.parts.length) {
    throw new Error(
      `值数量不匹配：期望 ${this.parts.length}，实际 ${values.length}`
    );
  }
  
  for (let i = 0; i < this.parts.length; i++) {
    this.parts[i].setValue(values[i]);
  }
}
```

### 6. render 函数

主渲染函数，管理容器的模板实例。

```typescript
function render(
  result: TemplateResult,
  container: Element | DocumentFragment
): void
```

**实现策略：**

```typescript
// 全局缓存
const templateCache = new Map<TemplateStringsArray, Template>();
const instanceCache = new WeakMap<Element | DocumentFragment, TemplateInstance>();

export function render(
  result: TemplateResult,
  container: Element | DocumentFragment
): void {
  // 1. 验证容器
  if (!(container instanceof Element || container instanceof DocumentFragment)) {
    throw new TypeError('容器必须是 Element 或 DocumentFragment');
  }
  
  // 2. 获取或创建 Template
  let template = templateCache.get(result.strings);
  if (!template) {
    template = new Template(result.strings);
    templateCache.set(result.strings, template);
  }
  
  // 3. 获取现有实例
  const existingInstance = instanceCache.get(container);
  
  // 4. 判断是否可以复用
  if (existingInstance && existingInstance.template === template) {
    // 复用：仅更新值
    existingInstance.update(result.values);
  } else {
    // 重建：清空容器，创建新实例
    container.textContent = ''; // 清空
    const newInstance = new TemplateInstance(template);
    newInstance.update(result.values);
    newInstance.appendTo(container);
    instanceCache.set(container, newInstance);
  }
}
```

**缓存策略：**
- **Template 缓存**：使用 Map，键为 TemplateStringsArray
  - JavaScript 保证相同模板字面量的 strings 引用相同
  - 全局缓存，跨容器共享
- **Instance 缓存**：使用 WeakMap，键为容器
  - 每个容器一个实例
  - 自动垃圾回收

## 数据模型

### 类型定义

```typescript
// html.ts
export interface TemplateResult {
  readonly strings: TemplateStringsArray;
  readonly values: readonly unknown[];
}

// part.ts
export interface Part {
  setValue(value: unknown): void;
}

// template.ts
export class Template {
  readonly strings: TemplateStringsArray;
  readonly element: HTMLTemplateElement;
  constructor(strings: TemplateStringsArray);
}

// render.ts
class TemplateInstance {
  readonly template: Template;
  readonly parts: Part[];
  constructor(template: Template);
  update(values: readonly unknown[]): void;
  appendTo(container: Element | DocumentFragment): void;
}
```

### 对象关系

```
TemplateResult
    ↓ (strings)
Template (缓存)
    ↓ (clone)
TemplateInstance (每容器一个)
    ↓ (contains)
Part[] (每个插值一个)
    ↓ (updates)
Text 节点
```

### 生命周期

1. **Template 生命周期**：
   - 创建：首次遇到特定 strings 时
   - 存活：全局缓存，直到页面卸载
   - 共享：所有使用相同模板的渲染

2. **TemplateInstance 生命周期**：
   - 创建：首次渲染到容器或模板结构变化时
   - 存活：直到容器被垃圾回收或模板结构变化
   - 更新：每次 render 调用时

3. **Part 生命周期**：
   - 创建：TemplateInstance 创建时
   - 存活：与 TemplateInstance 相同
   - 更新：每次 TemplateInstance.update 时


## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1：html 函数返回有效的 TemplateResult

*对于任意* TemplateStringsArray 和值数组，调用 html 函数应该返回一个包含这些 strings 和 values 的 TemplateResult 对象，且不产生任何 DOM 副作用。

**验证需求：1.1, 1.2**

### 属性 2：TemplateResult 结构不变式

*对于任意* 通过 html 函数创建的 TemplateResult，其 strings.length 必须等于 values.length + 1。

**验证需求：1.5, 2.3**

### 属性 3：render 函数接受有效输入

*对于任意* 有效的 TemplateResult 和有效的容器（Element 或 DocumentFragment），render 函数应该成功执行而不抛出错误。

**验证需求：3.1**

### 属性 4：首次渲染创建 DOM

*对于任意* TemplateResult 和空容器，首次调用 render 后，容器应该包含与模板结构对应的 DOM 节点，且动态值应该正确显示。

**验证需求：3.2**

### 属性 5：相同模板更新仅修改值

*对于任意* 模板和两组不同的值，先渲染第一组值，再渲染第二组值时，容器中的 DOM 元素节点应该保持相同的引用（未重建），但文本内容应该更新为新值。

**验证需求：3.3, 7.2, 7.3**

### 属性 6：不同模板触发重建

*对于任意* 两个不同的模板（strings 不同），先渲染第一个模板，再渲染第二个模板时，容器应该被清空并重新构建 DOM。

**验证需求：3.4, 7.4**

### 属性 7：支持多种值类型

*对于任意* string、number、null 或 undefined 类型的值，渲染后应该在 DOM 中正确显示（null 和 undefined 显示为空字符串）。

**验证需求：6.1, 6.2**

### 属性 8：值相等时跳过更新

*对于任意* 模板和值，连续两次渲染相同的值时，第二次渲染不应该修改 DOM 文本节点的内容（使用 Object.is 比较，包括 NaN 的正确处理）。

**验证需求：6.3, 6.4**

### 属性 9：值不同时更新文本

*对于任意* 模板和两个不同的值（Object.is 返回 false），先渲染第一个值，再渲染第二个值时，对应的文本节点内容应该更新为新值的字符串表示。

**验证需求：6.5**

## 错误处理

### 错误类型

1. **TypeError**：容器类型无效
   - 条件：container 不是 Element 或 DocumentFragment
   - 消息：`"容器必须是 Element 或 DocumentFragment"`

2. **Error**：值数量不匹配
   - 条件：values.length ≠ parts.length
   - 消息：`"值数量不匹配：期望 X，实际 Y"`

### 错误处理策略

- **快速失败**：在 render 函数入口验证容器类型
- **明确消息**：提供清晰的错误描述和期望值
- **不捕获异常**：让错误向上传播，由调用者处理

### 边界情况

1. **空模板**：`html``（无插值）
   - 行为：正常渲染静态内容
   - values 为空数组

2. **仅插值**：`html`${value}``
   - 行为：strings = ['', '']，values = [value]
   - 正常处理

3. **null/undefined 值**：
   - 转换为空字符串
   - 不抛出错误

4. **NaN 值**：
   - 使用 Object.is() 正确比较
   - NaN === NaN 在 Object.is 中为 true

5. **连续相同值**：
   - 跳过 DOM 更新
   - 性能优化

## 测试策略

### 双重测试方法

本项目采用单元测试和基于属性的测试相结合的方法：

- **单元测试**：验证特定示例、边缘情况和错误条件
- **属性测试**：验证所有输入的通用属性

两者互补，共同提供全面的覆盖：单元测试捕获具体的 bug，属性测试验证一般正确性。

### 基于属性的测试配置

**测试库**：使用 `fast-check` 进行基于属性的测试（JavaScript/TypeScript 生态中的标准 PBT 库）

**配置要求**：
- 每个属性测试最少运行 100 次迭代
- 每个测试必须引用其设计文档属性
- 标签格式：`Feature: minimal-lit-html, Property N: [属性文本]`

### 测试覆盖范围

**单元测试重点**：
1. API 导出验证
2. 错误处理示例
3. 边缘情况（空模板、null 值等）
4. 特定的集成场景

**属性测试重点**：
1. html 函数的纯函数特性
2. TemplateResult 结构不变式
3. 首次渲染的正确性
4. 更新渲染的 DOM 复用
5. 值类型处理
6. 值比较和更新逻辑

### 测试数据生成策略

**生成器设计**：
- **strings 生成器**：生成有效的 HTML 片段数组
- **values 生成器**：生成 string、number、null、undefined 的混合
- **模板生成器**：确保 strings.length = values.length + 1
- **容器生成器**：创建 div 元素或 DocumentFragment

**智能约束**：
- 限制 HTML 复杂度以保持测试速度
- 确保生成的 HTML 是有效的
- 覆盖边缘情况（空字符串、特殊字符等）

### 测试执行

```bash
# 运行所有测试
npm test

# 仅运行单元测试
npm run test:unit

# 仅运行属性测试
npm run test:property
```

### 成功标准

- 所有单元测试通过
- 所有属性测试通过（100+ 迭代）
- 代码覆盖率 > 90%
- 无未处理的边缘情况
