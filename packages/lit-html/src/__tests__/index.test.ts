import { describe, it, expect } from 'vitest';
import { html, render } from '../index.js';

describe('公共 API 导出', () => {
  describe('单元测试：导出验证', () => {
    it('应该导出 html 函数', () => {
      // 验证需求：10.1
      expect(html).toBeDefined();
      expect(typeof html).toBe('function');
    });

    it('应该导出 render 函数', () => {
      // 验证需求：10.2
      expect(render).toBeDefined();
      expect(typeof render).toBe('function');
    });

    it('html 函数应该可以正常工作', () => {
      const result = html`<div>${'test'}</div>`;
      expect(result).toBeDefined();
      expect(result.strings).toBeDefined();
      expect(result.values).toBeDefined();
    });

    it('导出的函数应该与直接导入的函数相同', async () => {
      const { html: directHtml } = await import('../html.js');
      const { render: directRender } = await import('../render.js');
      
      expect(html).toBe(directHtml);
      expect(render).toBe(directRender);
    });
  });
});
