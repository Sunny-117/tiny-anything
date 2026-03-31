import {Observable} from '../rxjs'

const observable = new Observable((sub)=>{
    sub.next(1)
    sub.next(2)
    sub.next(3)
    sub.complete()
})
console.log(observable)

// observable.subscribe({
//     next: (value)=>console.log('next value', value),
//     error: (error)=>console.error(error),
//     complete: ()=>console.log('complete')
// })
// 可以只传递一个next函数
observable.subscribe((value)=>console.log('next value', value))