import { fromEvent, of, timer } from 'rxjs';
import { debounce, debounceTime, switchMap } from 'rxjs/operators';

const inputElement = document.querySelector('#keyword');
const wordsElement = document.querySelector('#words');

// 监听输入框的输入事件
const input$ = fromEvent(inputElement, 'input');
input$.subscribe(event => { console.log(event) });

// 对输入事件进行处理，延迟 100 毫秒后发送请求
const search$ = input$.pipe(
    debounceTime(100),
    //debounce 操作符，它可以根据一个指定的函数来判断是否发出事件
    //debounce 操作符的好处在于，它可以根据我们提供的函数动态地决定是否发出事件
    debounce((event) => event.target.value.length > 3 ? of(event) : timer(3000)), // 延迟 100 毫秒
    switchMap(event => fetch(`http://localhost:8080/api/search?q=${event.target.value}`)) // 发送请求
);
// 处理请求结果，渲染到页面
search$.subscribe(response => {
    response.json().then(data => {
        // 将响应结果渲染到页面
        wordsElement.innerHTML = data.map(item => `<li>${item}</li>`).join('');
    });
});