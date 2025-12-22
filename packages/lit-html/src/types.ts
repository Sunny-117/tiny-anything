/**
 * 核心类型定义
 */

/**
 * 模板结果：html 标签函数的返回值
 * 包含静态模板字符串和动态插值
 */
export interface TemplateResult {
  readonly strings: TemplateStringsArray;
  readonly values: readonly unknown[];
}

/**
 * Part 接口：表示模板中的动态插入点
 * 负责更新 DOM 中的特定位置
 */
export interface Part {
  /**
   * 设置新值并更新 DOM
   * @param value 新的值（string, number, null, undefined）
   */
  setValue(value: unknown): void;
}
