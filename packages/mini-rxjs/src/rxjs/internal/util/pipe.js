/**
 * 把一个函数的数组变成一个函数 compose
 * @param {*} fns
 */
export function pipeFromArray(fns) {
  if (fns.length === 0) {
    return (x) => x;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function (input) {
    //fns = [a,b,c]
    //input
    return fns.reduce((prev, fn) => fn(prev), input);
  };
}

function a(str) {
  return "a" + str;
}
function b(str) {
  return "b" + str;
}
function c(str) {
  return "c" + str;
}

let res = c(b(a("hello")));
