// 导入 minimal-lit-html
import { html, render } from '../dist/index.js';

// ============================================
// 示例 1：基本渲染和更新
// ============================================
const names = ['Steve', 'Kevin', 'Alice', 'Bob', 'Charlie'];
let currentNameIndex = 0;

const view = (name) => html`<div>Hello ${name}!</div>`;

const app = document.getElementById('app');
render(view(names[currentNameIndex]), app);

document.getElementById('btn-update').addEventListener('click', () => {
  currentNameIndex = (currentNameIndex + 1) % names.length;
  render(view(names[currentNameIndex]), app);
  console.log('示例 1: 更新名字为', names[currentNameIndex]);
});

// ============================================
// 示例 2：DOM 节点复用
// ============================================
let count = 0;

const counterView = (n) => html`
  <div>
    <p>计数器: ${n}</p>
    <p>这个 DOM 节点会被复用，只有文本内容会更新</p>
  </div>
`;

const app2 = document.getElementById('app2');
render(counterView(count), app2);

document.getElementById('btn-increment').addEventListener('click', () => {
  count++;
  render(counterView(count), app2);
  console.log('示例 2: 计数器增加到', count);
});

// ============================================
// 示例 3：模板切换
// ============================================
let useTemplateA = true;

const templateA = (msg) => html`<div class="template-a"><h3>模板 A</h3><p>${msg}</p></div>`;
const templateB = (msg) => html`<div class="template-b"><h3>模板 B</h3><p>${msg}</p></div>`;

const app3 = document.getElementById('app3');
render(templateA('这是模板 A'), app3);

document.getElementById('btn-toggle').addEventListener('click', () => {
  useTemplateA = !useTemplateA;
  if (useTemplateA) {
    render(templateA('这是模板 A'), app3);
    console.log('示例 3: 切换到模板 A（DOM 重建）');
  } else {
    render(templateB('这是模板 B'), app3);
    console.log('示例 3: 切换到模板 B（DOM 重建）');
  }
});

// ============================================
// 示例 4：用户输入
// ============================================
const greetingView = (name) => {
  if (!name) {
    return html`<p>请输入你的名字</p>`;
  }
  return html`<p>你好，<strong>${name}</strong>！欢迎使用 minimal-lit-html。</p>`;
};

const app4 = document.getElementById('app4');
render(greetingView(''), app4);

document.getElementById('name-input').addEventListener('input', (e) => {
  const name = e.target.value;
  render(greetingView(name), app4);
});

// ============================================
// 原始 spec 中的示例用例
// ============================================
console.log('=== 原始 spec 示例 ===');
const specView = (name) => html`<div>Hello ${name}</div>`;

const root = document.createElement('div');
document.body.appendChild(root);

render(specView('Steve'), root);
console.log('首次渲染:', root.innerHTML);
// DOM: <div>Hello Steve</div>

render(specView('Kevin'), root);
console.log('更新渲染:', root.innerHTML);
// DOM: <div>Hello Kevin</div>
// 只更新 Text 节点

console.log('=== Demo 加载完成 ===');
console.log('打开开发者工具查看更多日志信息');
