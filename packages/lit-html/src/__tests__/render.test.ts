import { describe, it, expect, vi, beforeEach } from 'vitest';
import { html } from '../html.js';
import { render } from '../render.js';

// Mock DOM globals
beforeEach(() => {
  if (typeof Element === 'undefined') {
    (global as any).Element = class Element {};
    (global as any).DocumentFragment = class DocumentFragment {};
  }
});

describe('render 函数', () => {
  describe('单元测试：错误处理', () => {
    it('应该在容器无效时抛出 TypeError', () => {
      // 验证需求：9.2
      const result = html`<div>${'test'}</div>`;
      const invalidContainer = {} as any;
      
      expect(() => render(result, invalidContainer)).toThrow(TypeError);
      expect(() => render(result, invalidContainer)).toThrow('容器必须是 Element 或 DocumentFragment');
    });

    it('应该在容器为 null 时抛出 TypeError', () => {
      const result = html`<div>${'test'}</div>`;
      
      expect(() => render(result, null as any)).toThrow(TypeError);
    });

    it('应该在容器为 undefined 时抛出 TypeError', () => {
      const result = html`<div>${'test'}</div>`;
      
      expect(() => render(result, undefined as any)).toThrow(TypeError);
    });

    it('应该在容器为字符串时抛出 TypeError', () => {
      const result = html`<div>${'test'}</div>`;
      
      expect(() => render(result, 'container' as any)).toThrow(TypeError);
    });

    it('应该在容器为数字时抛出 TypeError', () => {
      const result = html`<div>${'test'}</div>`;
      
      expect(() => render(result, 123 as any)).toThrow(TypeError);
    });
  });

  describe('单元测试：API 验证', () => {
    it('render 函数应该存在并且是一个函数', () => {
      expect(render).toBeDefined();
      expect(typeof render).toBe('function');
    });

    it('render 函数应该接受两个参数', () => {
      expect(render.length).toBe(2);
    });
  });
});
