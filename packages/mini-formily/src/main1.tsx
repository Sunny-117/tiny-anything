import React from 'react';
import { createRoot } from 'react-dom/client'

// import { observable, autorun } from '@formily/reactive'
// import { observer } from '@formily/reactive-react'

import { observable, autorun } from '../packages/reactive'
import { observer } from '../packages/reactive-react'

const values = { name:'小明', age: 18 }
const observableValues = observable(values)

autorun(() => {
  console.log("[reactive autorun] observableValues.age =", observableValues.age)
})


const Counter = observer(() => {
  console.log("[reactive-react observer] observableValues.age =", observableValues.age)
  return (
    <div>
      <p>{observableValues.age}</p>
      <button onClick={() => observableValues.age++}>+</button>
    </div>
  )
})

createRoot(document.getElementById('root')).render(<Counter />);