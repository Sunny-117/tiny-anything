import { useImmer } from './use-immer';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface AppState {
  count: number;
  user: {
    name: string;
    age: number;
    address: {
      city: string;
      street: string;
    };
  };
  todos: Todo[];
}

function App() {
  const [state, updateState] = useImmer<AppState>({
    count: 0,
    user: {
      name: 'Alice',
      age: 25,
      address: {
        city: 'Beijing',
        street: 'Chaoyang',
      },
    },
    todos: [
      { id: 1, text: '学习 Immer', done: false },
      { id: 2, text: '理解 Proxy', done: false },
    ],
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>迷你 Immer 实现演示</h1>

      {/* 计数器 */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h2>1. 简单计数器</h2>
        <p>Count: {state.count}</p>
        <button onClick={() => updateState(draft => { draft.count++; })}>
          增加
        </button>
        <button onClick={() => updateState(draft => { draft.count--; })} style={{ marginLeft: '10px' }}>
          减少
        </button>
      </section>

      {/* 嵌套对象 */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h2>2. 深层嵌套对象修改</h2>
        <pre>{JSON.stringify(state.user, null, 2)}</pre>
        <button onClick={() => updateState(draft => {
          draft.user.address.city = 'Shanghai';
        })}>
          修改城市为 Shanghai
        </button>
        <button onClick={() => updateState(draft => {
          draft.user.age++;
        })} style={{ marginLeft: '10px' }}>
          年龄 +1
        </button>
      </section>

      {/* 数组操作 */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h2>3. 数组操作（结构共享）</h2>
        <ul>
          {state.todos.map(todoItem => (
            <li key={todoItem.id} style={{ textDecoration: todoItem.done ? 'line-through' : 'none' }}>
              {todoItem.text}
              <button 
                onClick={() => updateState(draft => {
                  const todo = draft.todos.find(t => t.id === todoItem.id);
                  if (todo) todo.done = !todo.done;
                })}
                style={{ marginLeft: '10px' }}
              >
                切换
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => updateState(draft => {
          draft.todos.push({
            id: Date.now(),
            text: `新任务 ${draft.todos.length + 1}`,
            done: false,
          });
        })}>
          添加任务
        </button>
      </section>

      {/* 原理说明 */}
      <section style={{ padding: '15px', backgroundColor: '#f5f5f5' }}>
        <h2>核心原理</h2>
        <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>✅ 使用 Proxy 拦截所有读写操作</li>
          <li>✅ 懒拷贝（Lazy Copy）：只在修改时才浅拷贝</li>
          <li>✅ 结构共享：未修改的部分完全复用（===）</li>
          <li>✅ 可变写法 → 不可变结果</li>
          <li>✅ 支持深层嵌套对象和数组</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
