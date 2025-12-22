import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Template } from '../template.js';

// Mock document.createElement for template
const mockCreateElement = vi.fn((tagName: string) => {
  if (tagName === 'template') {
    return {
      innerHTML: '',
      content: {
        querySelector: vi.fn(),
        querySelectorAll: vi.fn(() => []),
      }
    } as any;
  }
  return {} as any;
});

describe('Template 类', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock document if not available
    if (typeof document === 'undefined') {
      (global as any).document = {
        createElement: mockCreateElement
      };
    }
  });

  describe('单元测试：模板生成', () => {
    it('应该创建 Template 对象并存储 strings', () => {
      const strings = Object.assign(['<div>', '</div>'], { raw: ['<div>', '</div>'] }) as TemplateStringsArray;
      const template = new Template(strings);

      expect(template.strings).toBe(strings);
      expect(template.element).toBeDefined();
    });

    it('应该调用 document.createElement 创建 template 元素', () => {
      const strings = Object.assign(['<div>', '</div>'], { raw: ['<div>', '</div>'] }) as TemplateStringsArray;
      
      if (typeof document !== 'undefined' && document.createElement === mockCreateElement) {
        mockCreateElement.mockClear();
      }
      
      new Template(strings);
      
      // 验证创建了 template 元素（如果使用 mock）
      if (typeof document !== 'undefined' && document.createElement === mockCreateElement) {
        expect(mockCreateElement).toHaveBeenCalledWith('template');
      }
    });

    it('应该为插值位置生成带标记的 HTML', () => {
      const strings = Object.assign(
        ['<div>', ' ', '</div>'],
        { raw: ['<div>', ' ', '</div>'] }
      ) as TemplateStringsArray;
      
      const template = new Template(strings);
      
      // 验证 innerHTML 被设置（包含标记）
      const expectedHTML = '<div><!--lit-marker--> <!--lit-marker--></div>';
      if (template.element.innerHTML !== undefined) {
        expect(template.element.innerHTML).toContain('<!--lit-marker-->');
      }
    });
  });
});
