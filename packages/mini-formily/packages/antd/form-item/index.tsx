import React from 'react'
import { connect, mapProps } from '../../react'

interface BaseItemProps {
  children: React.ReactNode
  label: string
}

const BaseItem: React.FC<BaseItemProps>  = ({ children, label }) => {
  return (
    <div>
      <span>{label}</span>
      {children}
    </div>
  )
}

export const FormItem = connect(BaseItem, mapProps((props: any, field: any) => {
  return { ...props, label: field.props.title }
}))

export default FormItem