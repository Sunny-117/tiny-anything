import { age, name, treeshaking } from './msg.js'

function say() {
  console.log('hello', age)
}
say()
console.log(name)
