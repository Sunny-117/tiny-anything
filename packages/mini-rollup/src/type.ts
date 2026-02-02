import type { ModuleDeclaration, Statement } from 'acorn'
import type { Scope } from './ast/scope'
import type { Bundle } from './bundle'

export interface AstNode {
  [key: string]: any
}

export interface WalkOptions {
  enter: (node: AstNode, parent: AstNode | null, enter: EnterFunction, leave: LeaveFunction) => void
  leave: (node: AstNode, parent: AstNode | null, enter: EnterFunction, leave: LeaveFunction) => void
}

export type EnterFunction = (node: AstNode, parent: AstNode | null, enter: EnterFunction, leave: LeaveFunction) => void
export type LeaveFunction = (node: AstNode, parent: AstNode | null, enter: EnterFunction, leave: LeaveFunction) => void

export interface ScopeOptions {
  name?: string
  params: string[]
  parent: Scope | null
}

export interface BundleOptions {
  entry: string
  outputFileName?: string
}

export type StatementWithInclude = Statement & { _include?: boolean }
export type ModuleDeclarationWithInclude = ModuleDeclaration & { _include?: boolean }

export interface ModuleOptions {
  code: string
  path: string
  bundle: Bundle
}
