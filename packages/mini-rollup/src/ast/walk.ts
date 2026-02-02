import type { AstNode, EnterFunction, LeaveFunction, WalkOptions } from '../type'

export function walk(ast: AstNode, { enter, leave }: WalkOptions): void {
  dfsVisit(ast, null, enter, leave)
}

function dfsVisit(node: AstNode, parent: AstNode | null, enter: EnterFunction, leave: LeaveFunction): void {
  if (enter)
    enter(node, parent, enter, leave)

  const childKeys = Object.keys(node).filter(key => typeof node[key] === 'object')
  childKeys?.forEach((key) => {
    if (Array.isArray(node[key])) {
      for (const child of node[key])
        dfsVisit(child, node, enter, leave)
    }
    else if (node[key] && node[key].type) {
      dfsVisit(node[key], node, enter, leave)
    }
  })

  if (leave)
    leave(node, parent, enter, leave)
}
