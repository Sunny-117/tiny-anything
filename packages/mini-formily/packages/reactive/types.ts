import { ArraySet } from './array'

export type PropertyKey = string | number | symbol

export type OperationType = 
| 'add'
| 'delete'
| 'clear'
| 'set'
| 'get'
| 'iterate'
| 'has'

export interface IOperation {
  target?: any
  oldTarget?: any
  key?: PropertyKey
  value?: any
  oldValue?: any
  type?: OperationType
  receiver?: any
}

export interface IMemoQueueItem {
  value?: any
  deps?: any[]
}

export type Dispose = () => void

export interface IEffectQueueItem {
  dispose?: void | Dispose
  deps?: any[]
}

// 反应 函数 或者 对象
export type Reaction = ((...args: any[]) => any) & {
  _boundary?: number
  _name?: string
  _isComputed?: boolean
  _dirty?: boolean
  _context?: any
  _disposed?: boolean
  _property?: PropertyKey
  _computesSet?: ArraySet<Reaction>
  _reactionsSet?: ArraySet<ReactionsMap>
  _scheduler?: (reaction: Reaction) => void
  _memos?: {
    queue: IMemoQueueItem[]
    cursor: number
  }
  _effects?: {
    queue: IEffectQueueItem[]
    cursor: number
  }
}

export type ReactionsMap = Map<PropertyKey, ArraySet<Reaction>>