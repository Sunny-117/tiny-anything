import React from 'react'
import { FormContext } from '../shared'

export const FormProvider = (props) => {
  const form = props.form

  return (
    <FormContext.Provider value={form}>
      {props.children}
    </FormContext.Provider>
  )
}