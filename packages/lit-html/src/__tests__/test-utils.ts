/**
 * 测试工具：提供 DOM 环境
 */

// 为测试创建一个简单的 DOM 环境
export function setupDOM() {
  if (typeof document === 'undefined') {
    // 如果没有 DOM 环境，创建一个最小的 mock
    const { DOMParser } = require('linkedom');
    const parser = new DOMParser();
    const doc = parser.parseFromString('<!DOCTYPE html><html><body></body></html>', 'text/html');
    (global as any).document = doc;
    (global as any).HTMLTemplateElement = doc.defaultView.HTMLTemplateElement;
  }
}
