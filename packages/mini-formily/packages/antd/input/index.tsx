import { connect, mapProps } from '../../react'
import { Input as AntdInput } from 'antd'

export const Input = connect(AntdInput, mapProps((props: any) => {
  return {...props}
}))

export default Input