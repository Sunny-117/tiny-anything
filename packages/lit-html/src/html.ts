import type { TemplateResult } from './types.js';

/**
 * html 标签模板函数
 * 
 * 用于创建模板结果对象，不执行任何 DOM 操作。
 * JavaScript 引擎保证相同的模板字面量会共享相同的 strings 数组引用。
 * 
 * @param strings 模板字符串数组（静态部分）
 * @param values 插值数组（动态部分）
 * @returns TemplateResult 对象
 * 
 * @example
 * ```ts
 * const name = 'World';
 * const result = html`<div>Hello ${name}</div>`;
 * ```
 */
export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): TemplateResult {
  return {
    strings,
    values
  };
}
