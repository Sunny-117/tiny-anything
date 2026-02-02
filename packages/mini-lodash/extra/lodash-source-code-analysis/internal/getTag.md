# getTag（内部方法）

该函数为 lodash 内部封装的公用方法，并没有向外暴露。

该函数是返回 value 的 toString 值。

```js
const toString = Object.prototype.toString

function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}
```
