![lodash 源码解析](https://www.lodashjs.com/img/lodash.png)

Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库。

此仓库为 lodash 源码解析，主要是记录我对 lodash 源码的一些理解，点击[这里](https://lodash.lcs.show)可以访问。

本文档按照 [lodash 中文网](https://www.lodashjs.com/docs/lodash.chunk) 的目录进行，其中每个章节中包含 **文档** 与 **解析** 两个部分，其中文档来源于 [lodash 中文网](https://www.lodashjs.com/docs/lodash.chunk)。

::: tip
因为 lodash 的函数类或多或少得引用了 lodash 内封装的其他方法，比如 `_.chunk` 调用了 `_.slice` 方法，在 `_.chunk` 文档中仅会介绍 `_.slice` 函数的作用，不会介绍其原理，但是会在 `_.slice` 中附上链接，点击即可跳转。
:::
