import { useState } from 'react';
import { useSWR, mutate, SWRConfig } from './lib';

// 模拟 fetcher
const fetcher = (url) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url === '/api/user') {
        resolve({ id: 1, name: 'John Doe' });
      } else if (url.startsWith('/api/projects')) {
        const userId = url.split('uid=')[1];
        resolve([
          { id: 1, name: 'Project A', userId },
          { id: 2, name: 'Project B', userId }
        ]);
      }
    }, 1000);
  });
};

// 示例1：基本用法
function Profile() {
  const { data, error, isValidating } = useSWR('/api/user', fetcher);

  if (error) return <div>加载失败</div>;
  if (!data) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>用户信息</h2>
      <p>姓名: {data.name}</p>
      <p>ID: {data.id}</p>
      {isValidating && <span> (刷新中...)</span>}
    </div>
  );
}

// 示例2：依赖取数
function MyProjects() {
  const { data: user } = useSWR('/api/user', fetcher);
  const { data: projects } = useSWR(
    () => user ? `/api/projects?uid=${user.id}` : null,
    fetcher
  );

  if (!projects) return <div>加载项目中...</div>;
  
  return (
    <div>
      <h2>我的项目</h2>
      <p>你有 {projects.length} 个项目</p>
      <ul>
        {projects.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}

// 示例3：条件取数
function ConditionalFetch() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error } = useSWR(
    shouldFetch ? '/api/user' : null,
    fetcher
  );

  return (
    <div>
      <h2>条件取数</h2>
      <button onClick={() => setShouldFetch(!shouldFetch)}>
        {shouldFetch ? '停止取数' : '开始取数'}
      </button>
      {data && <p>数据: {data.name}</p>}
    </div>
  );
}

// 示例4：乐观更新
function OptimisticUpdate() {
  const { data, mutate: revalidate } = useSWR('/api/user', fetcher);

  const handleUpdate = async () => {
    if (!data) return;
    
    const newName = data.name.toUpperCase();
    
    // 乐观更新：立即更新本地数据
    mutate('/api/user', { ...data, name: newName });
    
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 重新验证
    revalidate();
  };

  if (!data) return <div>加载中...</div>;

  return (
    <div>
      <h2>乐观更新</h2>
      <p>姓名: {data.name}</p>
      <button onClick={handleUpdate}>转为大写</button>
    </div>
  );
}

// 示例5：全局配置
function Dashboard() {
  const { data } = useSWR('/api/user', fetcher);
  
  return (
    <div>
      <h2>Dashboard (使用全局配置)</h2>
      {data ? <p>欢迎, {data.name}!</p> : <p>加载中...</p>}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>简易版 SWR 示例</h1>
      
      <hr />
      <Profile />
      
      <hr />
      <MyProjects />
      
      <hr />
      <ConditionalFetch />
      
      <hr />
      <OptimisticUpdate />
      
      <hr />
      <SWRConfig value={{ 
        onSuccess: (data) => console.log('全局成功回调:', data),
        onError: (error) => console.error('全局错误回调:', error)
      }}>
        <Dashboard />
      </SWRConfig>
    </div>
  );
}

export default App;
