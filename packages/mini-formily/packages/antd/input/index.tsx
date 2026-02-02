import { connect, mapProps } from '../../react'
import { Input as AntdInput } from 'antd'

export const Input = connect(AntdInput, mapProps(props => {
  return {...props}
}))

export default Input