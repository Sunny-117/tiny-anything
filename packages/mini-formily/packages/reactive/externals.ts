import { isArr, isPlainObj } from './checkers';
import { ProxyRaw } from './environment'
import { MakeObservableSymbol } from "./environment";

const hasOwnProperty = Object.prototype.hasOwnProperty

export const isObservable = (target) => {
  return ProxyRaw.has(target);
}

export const isAnnotation = (target) => {
  return target && target[MakeObservableSymbol];
}

export const toJS = (values) => {
  const visited = new WeakSet<any>()

  const _toJS: typeof toJS = (values: any) => {
    if (visited.has(values)) {
      return values;
    }

    if (isArr(values)) {
      if (isObservable(values)) {
        visited.add(values)
        const res: any = []
        values.forEach((item: any) => {
          res.push(_toJS(item))
        })
        visited.delete(values)
        return res
      }
    } else if (isPlainObj(values)) {
      if (isObservable(values)) {
        visited.add(values)
        const res: any = {}
        for (const key in values) {
          if (hasOwnProperty.call(values, key)) {
            res[key] = _toJS(values[key])
          }
        }
        visited.delete(values)
        return res
      }
    }
    return values
  }


  return _toJS(values)
}