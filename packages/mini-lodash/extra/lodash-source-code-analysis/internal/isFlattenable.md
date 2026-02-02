# isFlattenable(内部函数)

```js
/** Built-in value reference. */
const spreadableSymbol = Symbol.isConcatSpreadable

function isFlattenable(value) {
  return Array.isArray(value) || isArguments(value) ||
    !!(value && value[spreadableSymbol])
}
```

此方法调用了 lodash 中另外一个封装的方法：

+ [isArguments](../lang/isArguments)：检查 value 是否是一个类 arguments 对象。

此方法的作用是检查 value 是否可以做扁平化处理，比如：

```text
[1, 2, [3, 4]] => [1, 2, 3, 4]
[1, 2, [3, [4]]] => [1, 2, 3, 4]
```

数组与 arguments 对象是可以做扁平化处理的，下面就要判断这两者之外的情况。

内置的 `Symbol.isConcatSpreadable` 符号用于配置某对象作为 [`Array.prototype.concat()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) 方法的参数时是否展开其数组元素。

只要判断 value 的 `Symbol.isConcatSpreadable` 属性为 true，则可以进行扁平化处理。
