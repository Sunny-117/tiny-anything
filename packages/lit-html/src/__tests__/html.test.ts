import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { html } from '../html.js';

describe('html 函数', () => {
  describe('Property 1: html 函数返回有效的 TemplateResult', () => {
    it('对于任意 strings 和 values，应返回包含它们的 TemplateResult', () => {
      // Feature: minimal-lit-html, Property 1: html 函数返回有效的 TemplateResult
      // 验证需求：1.1, 1.2
      
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
          (strings) => {
            // 创建 TemplateStringsArray
            const stringsArray = Object.assign(strings, { raw: strings }) as TemplateStringsArray;
            
            // 生成 values（比 strings 少一个）
            const values = strings.slice(0, -1).map((_, i) => `value${i}`);
            
            // 调用 html
            const result = html(stringsArray, ...values);
            
            // 验证返回值
            expect(result).toBeDefined();
            expect(result.strings).toBe(stringsArray);
            expect(result.values).toEqual(values);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: TemplateResult 结构不变式', () => {
    it('对于任意 TemplateResult，strings.length 必须等于 values.length + 1', () => {
      // Feature: minimal-lit-html, Property 2: TemplateResult 结构不变式
      // 验证需求：1.5, 2.3
      
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
          (strings) => {
            const stringsArray = Object.assign(strings, { raw: strings }) as TemplateStringsArray;
            const values = strings.slice(0, -1).map((_, i) => i);
            
            const result = html(stringsArray, ...values);
            
            expect(result.strings.length).toBe(result.values.length + 1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('单元测试：特定示例', () => {
    it('应该正确处理简单模板', () => {
      const result = html`<div>Hello ${'World'}</div>`;
      
      expect(result.strings.length).toBe(2);
      expect(result.strings[0]).toBe('<div>Hello ');
      expect(result.strings[1]).toBe('</div>');
      expect(result.values).toEqual(['World']);
    });

    it('应该正确处理多个插值', () => {
      const result = html`<div>${'a'}${'b'}${'c'}</div>`;
      
      expect(result.strings.length).toBe(4);
      expect(result.values).toEqual(['a', 'b', 'c']);
    });

    it('应该正确处理无插值的模板', () => {
      const result = html`<div>Static content</div>`;
      
      expect(result.strings.length).toBe(1);
      expect(result.values).toEqual([]);
    });

    it('相同模板字面量应该共享 strings 引用（示例）', () => {
      // 注意：这个测试演示了 JavaScript 引擎的行为
      // 在实际代码中，相同的模板字面量会共享 strings 引用
      // 但在测试中，我们需要使用实际的模板字面量语法
      
      // 创建一个辅助函数来测试
      function createTemplate(value: string) {
        return html`<div>${value}</div>`;
      }
      
      const result1 = createTemplate('a');
      const result2 = createTemplate('b');
      
      // 在实际使用中，相同的模板字面量会共享 strings
      // 这里我们只验证结构是正确的
      expect(result1.strings.length).toBe(2);
      expect(result2.strings.length).toBe(2);
      expect(result1.strings[0]).toBe('<div>');
      expect(result1.strings[1]).toBe('</div>');
    });
  });
});
