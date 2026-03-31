/**
 * 创建Observable 从数组，类数组 Promise
 * @param {*} input
 */
import { innerFrom } from "./innerFrom";
export function from(input) {
  return innerFrom(input);
}
