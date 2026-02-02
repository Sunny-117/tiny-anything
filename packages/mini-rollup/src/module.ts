import type { Identifier, ImportSpecifier, ModuleDeclaration, Program, Statement } from 'acorn'
import type { Bundle } from './bundle'
import type { ModuleDeclarationWithInclude, ModuleOptions, StatementWithInclude } from './type'
import { parse } from 'acorn'
import MagicString from 'magic-string'
import { analysis } from './ast/analysis'
import { hasOwnProporty } from './utils'

export class Module {
  code: MagicString
  path: string
  bundle: Bundle
  ast: Program
  imports: Record<string, any> = {}
  exports: Record<string, any> = {}
  definitions: Record<string, Statement | ModuleDeclaration> = {}
  constructor({ code, path, bundle } = {} as ModuleOptions) {
    this.code = new MagicString(code, { filename: path })
    this.path = path
    this.bundle = bundle
    this.ast = parse(code, {
      ecmaVersion: 7,
      sourceType: 'module',
    })
    this.analysis()
  }

  analysis() {
    this.imports = {}
    this.exports = {}
    this.ast.body.forEach((node) => {
      if (node.type === 'ImportDeclaration') {
        const source = node.source.value
        const specifiers = node.specifiers
        specifiers.forEach((specifier) => {
          const name = ((specifier as ImportSpecifier).imported as Identifier).name
          const localName = specifier.local.name
          this.imports[localName] = { name, localName, source }
        })
      }
      else if (node.type === 'ExportNamedDeclaration') {
        const declaration = node.declaration
        if (declaration && declaration.type === 'VariableDeclaration') {
          const name = (declaration.declarations[0].id as Identifier).name
          // this.exports['age'] =  {node, localName: age, expression}
          this.exports[name] = {
            node,
            localName: name,
            expression: declaration,
          }
        }
      }
    })
    analysis(this.ast, this.code)
    this.definitions = {} // 存放所有全局变量的定义域
    this.ast.body.forEach((statement) => {
      Object.keys((statement as any)._defines).forEach((name) => {
        // {'全局变量名': '定义这个全局变量的语句'}
        this.definitions[name] = statement
      })
    })
  }

  expendAllStatements() {
    const allStatements: Array<Statement | ModuleDeclaration> = []
    this.ast.body.forEach((statement) => {
      if (statement.type === 'ImportDeclaration') // 导入语句不需要了
        return
      const statements = this.expendStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }

  expendStatement(statement: StatementWithInclude | ModuleDeclarationWithInclude) {
    const result = []
    const dependencies = Object.keys((statement as any)._dependsOn)
    dependencies.forEach((name) => {
      // define: 找到定义这个变量的声明节点，这个节点可能在当前模块内，也可能在依赖的模块里面
      const definition = this.define(name)
      result.push(...definition)
    })
    if (!statement._include) {
      statement._include = true
      result.push(statement)
    }
    return result
  }

  define(name: string): any[] {
    // 导入的变量里面有没有这个变量名
    if (hasOwnProporty(this.imports, name)) {
      // this.imports.age = {name: 'age', localName: 'age', source: './msg'}
      const importData = this.imports[name]
      const module = this.bundle.fetchModule(importData.source, this.path)
      const exportData = module?.exports[importData.name]
      // 调用msg模块的define方法，参数是msg模块的本地变量名age，为了返回定义age变量的语句
      return module?.define(exportData.localName) || []
    }
    else {
      // definitions: {当前模块的变量名：定义这个变量的语句}
      const statement = this.definitions[name]
      if (statement && !(statement as any)._include)
        return this.expendStatement(statement)

      else
        return []
    }
  }
}
