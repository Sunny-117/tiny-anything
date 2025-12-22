# 实现计划：minimal-lit-html

## 概述

本实现计划将 minimal-lit-html 的设计转换为可执行的编码任务。实现将按照模块化的方式进行，从核心数据结构开始，逐步构建到完整的渲染系统。每个任务都包含具体的实现目标和需求引用。

## 任务

- [x] 1. 设置项目结构和类型定义
  - 创建 `src/` 目录结构
  - 创建 TypeScript 配置文件（tsconfig.json）
  - 定义核心接口和类型（TemplateResult, Part）
  - _需求：10.4_

- [ ] 2. 实现 html 标签函数
  - [x] 2.1 实现 html 函数
    - 在 `src/html.ts` 中创建 html 函数
    - 接受 TemplateStringsArray 和 values 参数
    - 返回 TemplateResult 对象
    - _需求：1.1, 1.2_

  - [x] 2.2 为 html 函数编写属性测试
    - **属性 1：html 函数返回有效的 TemplateResult**
    - **属性 2：TemplateResult 结构不变式**
    - **验证需求：1.1, 1.2, 1.5, 2.3**

- [ ] 3. 实现 Template 类
  - [x] 3.1 创建 Template 类
    - 在 `src/template.ts` 中实现 Template 类
    - 实现 createTemplate 方法生成带标记的 HTML
    - 使用注释节点 `<!--lit-marker-->` 作为标记
    - _需求：4.1, 4.2, 4.5_

  - [x] 3.2 编写 Template 类的单元测试
    - 测试模板生成的正确性
    - 验证标记节点的插入
    - _需求：4.2_

- [ ] 4. 实现 Part 接口和 TextPart 类
  - [x] 4.1 实现 Part 接口和 TextPart
    - 在 `src/part.ts` 中定义 Part 接口
    - 实现 TextPart 类
    - 实现 setValue 方法，使用 Object.is() 比较值
    - 处理 null/undefined 转换为空字符串
    - _需求：6.1, 6.2, 6.3, 8.1, 8.2_

  - [x] 4.2 为 TextPart 编写属性测试
    - **属性 7：支持多种值类型**
    - **属性 8：值相等时跳过更新**
    - **属性 9：值不同时更新文本**
    - **验证需求：6.1, 6.2, 6.3, 6.4, 6.5**

- [ ] 5. 实现 TemplateInstance 类
  - [x] 5.1 创建 TemplateInstance 类
    - 在 `src/render.ts` 中实现 TemplateInstance 类
    - 实现 createParts 方法，使用 TreeWalker 定位标记
    - 将注释标记替换为文本节点
    - 为每个文本节点创建 TextPart
    - _需求：5.3, 5.4_

  - [x] 5.2 实现 update 方法
    - 验证 values 数量与 parts 数量匹配
    - 遍历 parts 调用 setValue
    - 抛出错误如果数量不匹配
    - _需求：6.4, 6.5, 9.1_

  - [x] 5.3 实现 appendTo 方法
    - 将 fragment 添加到容器
    - _需求：3.2_

  - [x] 5.4 编写 TemplateInstance 的单元测试
    - 测试 parts 创建的正确性
    - 测试 update 方法的错误处理
    - _需求：5.3, 5.4, 9.1_

- [ ] 6. 检查点 - 确保核心组件测试通过
  - 确保所有测试通过，如有问题请询问用户

- [ ] 7. 实现 render 函数
  - [x] 7.1 实现缓存机制
    - 创建全局 templateCache (Map)
    - 创建 instanceCache (WeakMap)
    - _需求：4.3, 7.1_

  - [x] 7.2 实现 render 函数核心逻辑
    - 验证容器类型，抛出 TypeError 如果无效
    - 获取或创建 Template（使用缓存）
    - 检查现有 TemplateInstance
    - 判断是否可以复用实例
    - 复用路径：调用 instance.update()
    - 重建路径：清空容器，创建新实例
    - _需求：3.1, 3.2, 3.3, 3.4, 7.2, 7.3, 7.4, 9.2_

  - [x] 7.3 为 render 函数编写属性测试
    - **属性 3：render 函数接受有效输入**
    - **属性 4：首次渲染创建 DOM**
    - **属性 5：相同模板更新仅修改值**
    - **属性 6：不同模板触发重建**
    - **验证需求：3.1, 3.2, 3.3, 3.4, 7.2, 7.3, 7.4**

  - [x] 7.4 编写错误处理的单元测试
    - 测试无效容器抛出 TypeError
    - 测试值数量不匹配抛出 Error
    - 验证错误消息的描述性
    - _需求：9.1, 9.2, 9.3_

- [ ] 8. 创建公共 API 导出
  - [x] 8.1 实现 index.ts
    - 导出 html 函数
    - 导出 render 函数
    - 导出 TemplateResult 类型
    - _需求：10.1, 10.2, 10.3_

  - [x] 8.2 编写 API 导出的单元测试
    - 验证 html 和 render 可以从 index 导入
    - _需求：10.1, 10.2_

- [x] 9. 检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户

- [ ] 10. 创建可运行的 demo
  - [x] 10.1 创建 demo HTML 文件
    - 创建 `demo/index.html`
    - 包含基本的 HTML 结构和容器元素

  - [x] 10.2 创建 demo JavaScript 文件
    - 创建 `demo/demo.js`
    - 演示基本的 html 和 render 使用
    - 演示值更新和 DOM 复用
    - 包含原始 spec 中的示例用例

  - [x] 10.3 配置构建工具
    - 配置 TypeScript 编译
    - 配置打包工具（如需要）
    - 确保 demo 可以在浏览器中运行

## 注意事项

- 每个任务都引用了具体的需求以便追溯
- 检查点确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证特定示例和边缘情况
