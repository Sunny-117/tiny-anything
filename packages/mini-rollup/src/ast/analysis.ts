import type { Program } from 'acorn'
import type MagicString from 'magic-string'
import type { AstNode } from '../type'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import consola from 'consola'
import { Scope } from './scope'
import { walk } from './walk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 找到当前模块使用到了那些变量，哪些变量是当前模块声明的，那些是导入的
 * @param ast
 * @param magicString
 * @param module
 */
export function analysis(ast: Program, magicString: MagicString) {
  let scope = new Scope() // 模块内部的全局作用域
  ast.body.forEach((statement) => {
    function addToScope(declaration: AstNode) {
      const name = declaration.id.name
      scope.add(name)
      if (!scope.parent) {
        // 当前是全局作用域
        (statement as any)._defines[name] = true
      }
    }
    Object.defineProperties(statement, {
      _defines: { value: {} }, // 当前模块定义的所有的全局变量
      _dependsOn: { value: {} }, // 当前模块没有定义，但是使用到的变量（依赖的外部变量）
      _included: { value: false, writable: true }, // 此语句是否已经被包含到打包结果中，防止多次打包
      __source: {
        value: magicString.snip(statement.start, statement.end),
      },
    })
    // 构建作用域链
    walk(statement, {
      enter(node) {
        let newScope
        switch (node.type) {
          case 'FunctionDeclaration':
            // eslint-disable-next-line no-case-declarations
            const params = node.params.map((param: any) => param.name)
            addToScope(node)
            // 函数：生成新的作用域
            newScope = new Scope({
              parent: scope,
              params,
            })
            break
          case 'VariableDeclaration':
            node.declarations.forEach(addToScope)
            break
        }
        if (newScope) { // 当前节点生成了新的作用域
          Object.defineProperty(node, '_scope', { value: newScope }) // _scope:指向新的作用域
          scope = newScope
        }
      },
      leave(node) {
        if (node._scope && scope.parent) // 如果此节点产生了一个新的作用域，离开的时候scope回到父级作用域
          scope = scope.parent
      },
    })
  })
  consola.info('第一次遍历：', scope);
  (ast as any)._scope = scope
  // 找到外部依赖 _dependsOn
  ast.body.forEach((statement) => {
    walk(statement, {
      enter(node) {
        if (node._scope) {
          // 如果这个节点有一个_scope属性，说明这个节点产生了新的作用域
          scope = node._scope
        }

        if (node.type === 'Identifier') {
          // 从当前作用域出发，向上递归，找到这个变量在哪个作用域中定义，找不到则是外部依赖
          const definingScope = scope.findDefineScope(node.name)
          if (!definingScope)
            (statement as any)._dependsOn[node.name] = true
        }
      },
      leave(node) {
        if (node._scope && scope.parent)
          scope = scope.parent
      },
    })
  })
  fs.writeFileSync(path.resolve(__dirname, 'ast.json'), JSON.stringify(ast), 'utf-8')
}
