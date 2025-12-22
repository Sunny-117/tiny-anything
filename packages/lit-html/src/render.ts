import type { TemplateResult } from './types.js';
import type { Part } from './types.js';
import { Template } from './template.js';
import { TextPart } from './part.js';

/**
 * TemplateInstance 类
 * 
 * 表示模板的一个渲染实例，维护 Parts 数组和当前状态。
 * 每个容器维护一个 TemplateInstance。
 */
class TemplateInstance {
  readonly template: Template;
  readonly parts: Part[];
  private fragment: DocumentFragment;

  constructor(template: Template) {
    this.template = template;
    this.fragment = template.element.content.cloneNode(true) as DocumentFragment;
    this.parts = this.createParts(this.fragment);
  }

  /**
   * 创建 Parts 数组
   * 
   * 使用 TreeWalker 遍历 fragment，找到所有标记注释节点，
   * 将它们替换为文本节点，并为每个文本节点创建 TextPart。
   * 
   * @param fragment 克隆的模板内容
   * @returns Parts 数组
   */
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

  /**
   * 更新所有 Parts 的值
   * 
   * @param values 新的值数组
   * @throws Error 如果值数量与 parts 数量不匹配
   */
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

  /**
   * 将 fragment 添加到容器
   * 
   * @param container 目标容器
   */
  appendTo(container: Element | DocumentFragment): void {
    container.appendChild(this.fragment);
  }
}

// 全局缓存
const templateCache = new Map<TemplateStringsArray, Template>();
const instanceCache = new WeakMap<Element | DocumentFragment, TemplateInstance>();

/**
 * render 函数
 * 
 * 将 TemplateResult 渲染到指定容器。
 * 首次渲染时创建 DOM，后续渲染时仅更新动态值。
 * 
 * @param result TemplateResult 对象
 * @param container 目标容器（Element 或 DocumentFragment）
 * @throws TypeError 如果容器类型无效
 */
export function render(
  result: TemplateResult,
  container: Element | DocumentFragment
): void {
  // 1. 验证容器类型
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
