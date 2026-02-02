import { toJS } from '../../reactive'

export const batchSubmit = (target, onSubmit) => {
  onSubmit(toJS(target.values))
}