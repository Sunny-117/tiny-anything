import type { Part } from './types.js';

/**
 * TextPart 类
 * 
 * 表示模板中的文本插值点。
 * 维护对 Text 节点的引用，并在值变化时更新节点内容。
 */
export class TextPart implements Part {
  private node: Text;
  private value: unknown;

  constructor(node: Text) {
    this.node = node;
    this.value = undefined;
  }

  /**
   * 设置新值并更新 DOM
   * 
   * 使用 Object.is() 比较新旧值，仅在值变化时更新 DOM。
   * null 和 undefined 会被转换为空字符串。
   * 
   * @param value 新的值
   */
  setValue(value: unknown): void {
    // 1. 规范化值：null/undefined 转为空字符串
    const normalized = value ?? '';

    // 2. 使用 Object.is() 比较新旧值
    // Object.is() 正确处理 NaN 和 ±0
    if (Object.is(this.value, normalized)) {
      return; // 值未变化，跳过更新
    }

    // 3. 更新 DOM
    this.node.textContent = String(normalized);
    this.value = normalized;
  }
}
