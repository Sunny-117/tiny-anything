import { useState, useRef } from 'react'
import { Tracker } from '../../reactive'

export const useObserver = (view) => {
  const [, setState] = useState({})
  const forceUpdate = () => setState({})
  const instRef = useRef(null)
  if (!instRef.current) {
    instRef.current = new Tracker(() => {
      forceUpdate()
    })
  }

  // 让 view 函数变成 effect 函数
  return instRef.current.track(view)
}