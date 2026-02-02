# tiny-rollup [![npm](https://img.shields.io/npm/v/tiny-rollup.svg)](https://npmjs.com/package/tiny-rollup)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

English | <a href="./README-zh_CN.md">简体中文</a>

<img src="./assets/logo.png" width="100%">

🌱 Featherlight Module Bundler | ⚡ Second-Level Build Speed | 🌳 Intelligent Tree-Shaking

## 🌟 Features

- 🎯 **Zero-config Startup** - Lightweight, out-of-the-box bundling capabilities
- 🌳 **Intelligent Tree-Shaking** - Automatically eliminates unused code
- 📦 **ESM First** - Native support for ES Modules
- 🗺 **Sourcemap Support** - Comprehensive debugging support
- ⚡ **Lightning-fast Bundling**

## 🚀 Quick Start

### Installation

```bash
pnpm i tiny-rollup
```

### Build

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

Check out the [example](https://github.com/Sunny-117/tiny-rollup/blob/main/playground/src/index.js) for more details.

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
