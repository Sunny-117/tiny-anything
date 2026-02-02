import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tinyRollup } from 'tiny-rollup'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const entryTest1 = resolve(__dirname, './main.js')
const outTest1 = resolve(__dirname, '../dist/bundle.js')

tinyRollup(entryTest1, outTest1)
