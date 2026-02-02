import React from 'react'
import { FieldContext } from '../shared'
import { ReactiveField } from './ReactiveField'
import { useForm } from '../hooks'

export const Field = (props) => {
  const form = useForm() // 获取表单模型
  const field = form.createField(props) //创建字段模型

  return (
    <FieldContext.Provider value={field}>
      <ReactiveField field={field}>{props.children}</ReactiveField>
    </FieldContext.Provider>
  )
}