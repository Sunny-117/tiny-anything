import React from 'react'
import { observer } from '../../reactive-react'
import { useField } from '../hooks'

export function mapProps(...propMappers) {
  // Target 就是 antd 的 Input 组件
  return (Target) => {

    // 组件内获取了 formily 的响应式数据，改变时会响应式刷新组件
    return observer((props) => {
      const field = useField()

      // 合并好的所有参数
      const result = propMappers.reduce((props, propMapper) => {
        return Object.assign(props, propMapper(props, field))
      }, { ...props })

      //return <Input {...result} />
      return React.createElement(Target, result)
    })
  }
}

/**
 * 
 * @param target UI库的组件 如：Input
 * @param enhanceTargets 执行 mapProps() 返回的函数
 * @returns 返回一个 render 执行渲染组件
 */
export function connect(target, ...enhanceTargets) {
  // 返回一个包装好参数的 react 组件
  const Target = enhanceTargets.reduce((target, enhanceTarget) => {
    return enhanceTarget(target)
  }, target)

  return (props) => {
    return React.createElement(Target, { ...props })
  }
}