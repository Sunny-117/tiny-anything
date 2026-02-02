import type { ModuleDeclaration, Statement } from 'acorn'
import type { BundleOptions } from './type'
import fs from 'node:fs'
import path, { resolve } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { Bundle as MagicStringBundle } from 'magic-string'
import { ensureDirExists } from 'notools'
import { Module } from './module'

export class Bundle {
  entryPath: string
  module: any
  statements: Array<Statement | ModuleDeclaration> = []
  options: BundleOptions
  constructor(options: BundleOptions = {} as BundleOptions) {
    this.options = options
    this.entryPath = `${options.entry.replace(/.js$/, '')}.js`
    this.module = {}
  }

  build() {
    const entryModule = this.fetchModule(this.entryPath)
    if (entryModule) {
      this.statements = entryModule.expendAllStatements()
      const { code } = this.generate()
      const { outputFileName } = this.options
      const outputDir = resolve(process.cwd(), 'dist')
      // if (!fs.existsSync(outputDir)) {
      //   fs.mkdirSync(outputDir, { recursive: true })
      // }
      let fullPath = `${outputDir}/bundle.js`
      if (outputFileName) {
        fullPath = outputFileName
      }
      ensureDirExists(fullPath)
      fs.writeFileSync(fullPath, code, 'utf-8')
      consola.success(`写入${fullPath}成功`)
    }
  }

  fetchModule(importee: string, importer?: string) {
    let route
    if (!importer) { // 如果没有模块导入此模块，说明这就是入口模块
      route = importee
    }
    else {
      if (path.isAbsolute(importee)) {
        // 绝对路径
        route = importee
      }
      else if (importee[0] === '.') {
        // 相对路径
        route = path.resolve(path.dirname(importer), `${importee.replace(/\.js$/, '')}.js`)
      }
    }
    if (route) {
      const code = fs.readFileSync(route, 'utf-8')
      const module = new Module({
        code,
        path: route,
        bundle: this,
      })
      return module
    }
  }

  generate() {
    const magicString = new MagicStringBundle()
    this.statements.forEach((statement) => {
      const source = (statement as any).__source.clone()
      if (statement.type === 'ExportNamedDeclaration')
      // export const name = 'abc' 开始位置截取到声明位置
        source.remove(statement.start, statement.declaration!.start)

      magicString.addSource({
        content: source,
        // separator: '\n',
      })
    })
    return { code: magicString.toString() }
  }
}
