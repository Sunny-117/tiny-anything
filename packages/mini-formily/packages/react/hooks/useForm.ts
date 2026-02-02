import { useContext } from 'react'
import { FormContext } from '../shared'
export const useForm = () => {
  return useContext(FormContext)
}