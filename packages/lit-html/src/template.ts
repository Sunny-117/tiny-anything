/**
 * Template 类
 * 
 * 表示已解析的模板结构，包含 HTMLTemplateElement 和标记位置。
 * Template 对象会被全局缓存，相同的 strings 数组只解析一次。
 */
export class Template {
  readonly strings: TemplateStringsArray;
  readonly element: HTMLTemplateElement;

  constructor(strings: TemplateStringsArray) {
    this.strings = strings;
    this.element = this.createTemplate(strings);
  }

  /**
   * 创建 HTMLTemplateElement
   * 
   * 将 strings 数组转换为 HTML 字符串，在插值位置插入标记注释节点。
   * 
   * @param strings 模板字符串数组
   * @returns HTMLTemplateElement
   */
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
}
