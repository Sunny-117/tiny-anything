# tiny-rollup [![npm](https://img.shields.io/npm/v/tiny-rollup.svg)](https://npmjs.com/package/tiny-rollup)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

简体中文 | <a href="./README-en.md">English</a>

<img src="./assets/logo.png" width="100%">

🌱 轻量模块打包器 | ⚡ 秒级构建 | 🌳 智能Tree-Shaking

## 🌟 特性

- 🎯 **零配置启动** - 轻量级、开箱即用的基础打包能力
- 🌳 **智能 Tree-Shaking** - 自动消除未使用代码
- 📦 **ESM 优先** - 原生支持 ES Modules
- 🗺 **Sourcemap 支持** - 完善的调试支持
- ⚡ **闪电打包**

## 🚀 快速入门

### 安装

```bash
pnpm i tiny-rollup
```

### 构建

```ts
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tinyRollup } from 'tiny-rollup'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const entryTest1 = resolve(__dirname, './main.js')
const outTest1 = resolve(__dirname, '../dist/bundle.js')

tinyRollup(entryTest1, outTest1)
```

查看[示例](https://github.com/Sunny-117/tiny-rollup/blob/main/playground/src/index.js)了解更多详情。

## License

[MIT](./LICENSE) License © [Sunny-117](https://github.com/Sunny-117)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/tiny-rollup?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/tiny-rollup
[npm-downloads-src]: https://img.shields.io/npm/dm/tiny-rollup?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/tiny-rollup
[license-src]: https://img.shields.io/github/license/Sunny-117/tiny-rollup.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/Sunny-117/tiny-rollup/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/tiny-rollup
