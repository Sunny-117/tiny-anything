export function isPromise(fn) {
  if (typeof fn.then === "function") return true;
  return false;
}
