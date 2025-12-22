/**
 * minimal-lit-html
 * 
 * 一个最小化的 lit-html 实现。
 * 
 * @example
 * ```ts
 * import { html, render } from 'minimal-lit-html';
 * 
 * const view = (name: string) => html`<div>Hello ${name}</div>`;
 * 
 * const container = document.getElementById('app')!;
 * render(view('World'), container);
 * ```
 */

// 导出核心函数
export { html } from './html.js';
export { render } from './render.js';

// 导出类型
export type { TemplateResult, Part } from './types.js';
