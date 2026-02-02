import React from 'react'
import { observer } from '../../reactive-react'

const ReactiveInternal = (props) => {
  const field = props.field

  // 包装组件
  const renderDecorator = (children) => {
    return React.createElement(field.decoratorType, {}, children)
  }

  // 核心组件
  const renderComponent = () => {
    const value = field.value
    const onChange = (event) => {
      field.onInput(event)
    }
    return React.createElement(field.componentType, { value, onChange })
  }
  return renderDecorator(renderComponent())
}

// observer 函数组件响应式
export const ReactiveField = observer(ReactiveInternal)