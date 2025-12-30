function Counter() {
  const [state, update] = useImmer({ count: 0 });

  const increment = () => {
    update(draft => {
      draft.count++;
    });
  };

  const decrement = () => {
    update(draft => {
      draft.count--;
    });
  };

  const reset = () => {
    // 也支持直接设置值
    update({ count: 0 });
  };

  return (
    <div>
      <h1>Count: {state.count}</h1>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Counter;
