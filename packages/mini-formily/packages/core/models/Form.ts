import { define, observable } from '../../reactive'
import { FormPath } from '../../shared'
import { Field } from './Field'
import { batchSubmit } from '../shared/internals'

export class Form {
  values = {} // 表单的值 
  fields = {} // 表单的字段

  constructor(props = {}) {
    this.initialize(props)
    this.makeObservable()
    this.makeValues()
  }
  initialize(props) {
    this.props = { ...props }
  }
  makeObservable() {
    define(this, {
      values: observable,
      fields: observable.shallow
    })
  }
  makeValues() {
    this.values = Object.assign({}, this.props.values || {})
  }
  createField(props) {
    const address = FormPath.parse().concat(props.name)
    new Field(address, props, this)
    return this.fields[address.entire]
  }

  getValuesIn(pattern) {
    return this.values[pattern.entire]
  }

  setValuesIn(pattern, value) {
    this.values[pattern.entire] = value
  }

  /**
   * 代理对象转化成普通对象
   * @param onSubmit 参数为普通对象
   * @returns 
   */
  submit = (onSubmit) => {
    return batchSubmit(this, onSubmit);
  }
}