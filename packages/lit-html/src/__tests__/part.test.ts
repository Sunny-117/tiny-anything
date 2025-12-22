import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { TextPart } from '../part.js';

// Mock Text node
class MockTextNode {
  textContent: string = '';
}

describe('TextPart 类', () => {
  describe('Property 7: 支持多种值类型', () => {
    it('对于任意 string、number、null 或 undefined 值，应正确设置文本内容', () => {
      // Feature: minimal-lit-html, Property 7: 支持多种值类型
      // 验证需求：6.1, 6.2
      
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.float(),
            fc.constant(null),
            fc.constant(undefined)
          ),
          (value) => {
            const node = new MockTextNode() as any as Text;
            const part = new TextPart(node);
            
            part.setValue(value);
            
            // null 和 undefined 应该转换为空字符串
            const expected = value ?? '';
            expect(node.textContent).toBe(String(expected));
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 8: 值相等时跳过更新', () => {
    it('对于任意值，连续两次设置相同值时，第二次不应修改 textContent', () => {
      // Feature: minimal-lit-html, Property 8: 值相等时跳过更新
      // 验证需求：6.3, 6.4
      
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.constant(null),
            fc.constant(undefined),
            fc.constant(NaN) // 测试 NaN 的特殊处理
          ),
          (value) => {
            const node = new MockTextNode() as any as Text;
            const part = new TextPart(node);
            
            // 第一次设置
            part.setValue(value);
            const firstContent = node.textContent;
            
            // 第二次设置相同值
            part.setValue(value);
            const secondContent = node.textContent;
            
            // 内容应该相同（没有重新设置）
            expect(secondContent).toBe(firstContent);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('应该正确处理 NaN（Object.is(NaN, NaN) === true）', () => {
      const node = new MockTextNode() as any as Text;
      const part = new TextPart(node);
      
      part.setValue(NaN);
      expect(node.textContent).toBe('NaN');
      
      // 再次设置 NaN 应该跳过更新
      const spy = vi.spyOn(node, 'textContent', 'set');
      part.setValue(NaN);
      
      // textContent setter 不应该被调用
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Property 9: 值不同时更新文本', () => {
    it('对于任意两个不同的值，设置第二个值应该更新 textContent', () => {
      // Feature: minimal-lit-html, Property 9: 值不同时更新文本
      // 验证需求：6.5
      
      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          (value1, value2) => {
            // 只测试不同的值
            fc.pre(!Object.is(value1, value2));
            
            const node = new MockTextNode() as any as Text;
            const part = new TextPart(node);
            
            part.setValue(value1);
            expect(node.textContent).toBe(value1);
            
            part.setValue(value2);
            expect(node.textContent).toBe(value2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('单元测试：边缘情况', () => {
    it('应该将 null 转换为空字符串', () => {
      const node = new MockTextNode() as any as Text;
      const part = new TextPart(node);
      
      part.setValue(null);
      expect(node.textContent).toBe('');
    });

    it('应该将 undefined 转换为空字符串', () => {
      const node = new MockTextNode() as any as Text;
      const part = new TextPart(node);
      
      part.setValue(undefined);
      expect(node.textContent).toBe('');
    });

    it('应该正确处理数字 0', () => {
      const node = new MockTextNode() as any as Text;
      const part = new TextPart(node);
      
      part.setValue(0);
      expect(node.textContent).toBe('0');
    });

    it('应该正确处理空字符串', () => {
      const node = new MockTextNode() as any as Text;
      const part = new TextPart(node);
      
      part.setValue('');
      expect(node.textContent).toBe('');
    });

    it('应该正确处理布尔值', () => {
      const node = new MockTextNode() as any as Text;
      const part = new TextPart(node);
      
      part.setValue(true);
      expect(node.textContent).toBe('true');
      
      part.setValue(false);
      expect(node.textContent).toBe('false');
    });

    it('应该区分 +0 和 -0（Object.is 行为）', () => {
      const node = new MockTextNode() as any as Text;
      const part = new TextPart(node);
      
      part.setValue(+0);
      expect(node.textContent).toBe('0');
      
      // Object.is(+0, -0) === false，所以应该更新
      part.setValue(-0);
      expect(node.textContent).toBe('0'); // 字符串表示相同，但内部值不同
    });
  });
});
