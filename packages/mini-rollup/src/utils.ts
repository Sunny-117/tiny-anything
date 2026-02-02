export function hasOwnProporty(obj: object, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
