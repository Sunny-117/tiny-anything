# 需求文档

## 简介

本文档规定了 lit-html 最小实现的需求，这是一个高性能的 HTML 模板渲染库。系统使用 JavaScript 模板字面量来表达 UI，将模板结构与数据分离，并高效地仅更新 DOM 的动态部分。

## 术语表

- **System（系统）**: 指 minimal-lit-html 库
- **Template_Literal（模板字面量）**: 使用反引号的 JavaScript 标签模板字面量语法
- **Template_Result（模板结果）**: 包含模板字符串和插值的不可变对象
- **Template（模板）**: 带有标记位置的已解析模板结构
- **Template_Instance（模板实例）**: 模板与其当前渲染状态的组合
- **Part（部件）**: 表示模板中动态插入点的抽象
- **Marker（标记）**: DOM 中的注释节点，标记动态值应插入的位置
- **Container（容器）**: 承载渲染内容的 DOM Element 或 DocumentFragment

## 需求

### 需求 1：模板标签函数

**用户故事：** 作为开发者，我想使用 `html` 模板标签来定义 UI 模板，以便我可以用动态值表达 HTML 结构。

#### 验收标准

1. THE System SHALL 提供接受 TemplateStringsArray 和 values 的 `html` 函数
2. WHEN 调用 `html` 时，THE System SHALL 返回 TemplateResult 对象而不生成 DOM
3. WHEN 多次使用相同的模板字面量时，THE System SHALL 保持一致的字符串数组引用
4. THE TemplateResult SHALL 包含只读的 strings 和 values 数组
5. THE System SHALL 确保 strings.length 等于 values.length + 1

### 需求 2：模板结果结构

**用户故事：** 作为开发者，我想让 TemplateResult 成为不可变的数据结构，以便模板定义在渲染过程中保持一致。

#### 验收标准

1. THE TemplateResult SHALL 包含只读的 strings 数组
2. THE TemplateResult SHALL 包含只读的 values 数组
3. THE System SHALL 强制 strings.length === values.length + 1
4. THE TemplateResult SHALL 在逻辑上是不可变的

### 需求 3：渲染函数

**用户故事：** 作为开发者，我想将模板渲染到 DOM 容器中，以便在浏览器中显示动态内容。

#### 验收标准

1. THE System SHALL 提供接受 TemplateResult 和 container 的 `render` 函数
2. WHEN 首次在容器上调用 render 时，THE System SHALL 解析模板、创建 DOM 并插入到容器中
3. WHEN 后续使用相同模板结构调用 render 时，THE System SHALL 仅更新动态插值
4. WHEN 使用不同模板结构调用 render 时，THE System SHALL 完全重建 DOM
5. THE System SHALL 每个容器仅维护一个活动的模板实例

### 需求 4：模板解析和缓存

**用户故事：** 作为开发者，我想让模板高效地解析和缓存，以便优化渲染性能。

#### 验收标准

1. THE System SHALL 从 strings 数组创建 Template 对象
2. THE System SHALL 在插值位置生成带有标记节点的 HTML
3. THE System SHALL 使用 strings 数组作为键全局缓存 Template 对象
4. WHEN 遇到相同的 strings 数组时，THE System SHALL 重用缓存的 Template
5. THE Template SHALL 包含带有解析内容的 HTMLTemplateElement

### 需求 5：DOM 标记管理

**用户故事：** 作为开发者，我想让系统跟踪动态插入点，以便高效地应用更新。

#### 验收标准

1. THE System SHALL 在每个插值位置插入注释节点作为标记
2. THE System SHALL 确保标记数量等于 values.length
3. WHEN 克隆模板内容时，THE System SHALL 定位所有标记节点
4. THE System SHALL 为每个标记节点创建一个 Part

### 需求 6：动态值更新

**用户故事：** 作为开发者，我想只更新变化的值到 DOM，以便渲染高效。

#### 验收标准

1. THE System SHALL 支持 string、number、null 和 undefined 值类型
2. WHEN 值为 null 或 undefined 时，THE System SHALL 将其转换为空字符串
3. THE System SHALL 使用 Object.is() 比较新旧值
4. WHEN 值相等时，THE System SHALL 跳过 DOM 更新
5. WHEN 值不同时，THE System SHALL 仅更新对应的 Text 节点
6. THE System SHALL NOT 使用 innerHTML 进行更新

### 需求 7：模板实例管理

**用户故事：** 作为开发者，我想在渲染过程中重用模板实例，以便在可能的情况下保留 DOM 节点。

#### 验收标准

1. THE System SHALL 使用 WeakMap 为每个容器缓存 TemplateInstance
2. WHEN 渲染到具有现有实例的容器时，THE System SHALL 检查模板结构是否匹配
3. WHEN 模板结构匹配时，THE System SHALL 重用 TemplateInstance 并更新 Parts
4. WHEN 模板结构不同时，THE System SHALL 清空容器并创建新实例

### 需求 8：文本部件实现

**用户故事：** 作为开发者，我想让文本插值高效更新，以便仅修改变化的文本节点。

#### 验收标准

1. THE System SHALL 实现带有 setValue 方法的 TextPart 类
2. THE TextPart SHALL 维护对其 Text 节点的引用
3. WHEN 调用 setValue 时，THE TextPart SHALL 比较新值与当前值
4. WHEN 值不同时，THE TextPart SHALL 更新 Text 节点内容
5. WHEN 值相等时，THE TextPart SHALL 跳过更新

### 需求 9：错误处理

**用户故事：** 作为开发者，我想在错误使用 API 时获得清晰的错误信息，以便快速调试问题。

#### 验收标准

1. WHEN values 数量与预期数量不匹配时，THE System SHALL 抛出 Error
2. WHEN container 不是有效的 Element 或 DocumentFragment 时，THE System SHALL 抛出 TypeError
3. THE System SHALL 提供描述性的错误消息

### 需求 10：公共 API 导出

**用户故事：** 作为开发者，我想要一个清晰的公共 API，以便轻松导入和使用该库。

#### 验收标准

1. THE System SHALL 导出 `html` 函数
2. THE System SHALL 导出 `render` 函数
3. THE System SHALL 导出 TemplateResult 类型
4. THE System SHALL 将代码组织到独立的模块中（html.ts、render.ts、template.ts、part.ts）
