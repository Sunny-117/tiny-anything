import { useObserver } from './hooks/useObserver'


export function observer(component) {
  const wrappedComponent = (props) => {
    return useObserver(() => component(props))
  }

  return wrappedComponent
}