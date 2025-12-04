import { useState } from 'react';
import { useSWR, mutate, SWRConfig } from './lib';

// 请求计数器
const requestCounter = {};

// 获取请求次数
export const getRequestCount = (url) => requestCounter[url] || 0;

// 重置计数器
export const resetRequestCounter = () => {
  Object.keys(requestCounter).forEach(key => {
    delete requestCounter[key];
  });
};

// 模拟 fetcher（带请求计数）
const fetcher = (url) => {
  // 记录请求次数
  requestCounter[url] = (requestCounter[url] || 0) + 1;
  console.log(`🚀 发送请求: ${url} (第 ${requestCounter[url]} 次)`);
  
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
      } else if (url === '/api/posts') {
        resolve([
          { id: 1, title: '文章标题 1' },
          { id: 2, title: '文章标题 2' },
          { id: 3, title: '文章标题 3' }
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

// 示例6：测试缓存 - 多个组件使用相同 API
function PostCard({ cardNumber }) {
  const { data, isValidating } = useSWR('/api/posts', fetcher);
  
  return (
    <div style={{ 
      border: '2px solid #4CAF50', 
      padding: '15px', 
      margin: '10px 0',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h4>📄 组件 {cardNumber} - 文章列表</h4>
      {isValidating && <p style={{ color: '#2196F3' }}>🔄 加载中...</p>}
      {data && (
        <ul style={{ margin: '10px 0' }}>
          {data.map(post => (
            <li key={post.id} style={{ margin: '5px 0' }}>
              {post.title}
            </li>
          ))}
        </ul>
      )}
      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        backgroundColor: '#e8f5e9',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>请求统计：</strong>
        该 API 总共发送了 <strong style={{ color: '#4CAF50' }}>
          {getRequestCount('/api/posts')}
        </strong> 次请求
      </div>
    </div>
  );
}

function CacheTest() {
  const [showCards, setShowCards] = useState(false);
  const [componentCount, setComponentCount] = useState(3);
  
  const handleToggle = () => {
    if (!showCards) {
      resetRequestCounter();
    }
    setShowCards(!showCards);
  };
  
  return (
    <div style={{ 
      border: '3px solid #2196F3', 
      padding: '20px', 
      borderRadius: '10px',
      backgroundColor: '#e3f2fd'
    }}>
      <h2>🧪 缓存测试 - 相同 API 不重复请求</h2>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <p style={{ margin: '5px 0' }}>
          <strong>📋 测试说明：</strong>
        </p>
        <ul style={{ marginLeft: '20px' }}>
          <li>点击按钮显示多个组件，它们都使用相同的 API (<code>/api/posts</code>)</li>
          <li>预期结果：<strong style={{ color: '#4CAF50' }}>只会发送 1 次请求</strong>，所有组件共享缓存数据</li>
          <li>打开控制台可以看到请求日志</li>
        </ul>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ marginRight: '10px' }}>
          组件数量：
          <input 
            type="number" 
            min="1" 
            max="10" 
            value={componentCount}
            onChange={(e) => setComponentCount(Number(e.target.value))}
            style={{ 
              marginLeft: '5px', 
              padding: '5px', 
              width: '60px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </label>
        <button 
          onClick={handleToggle}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: showCards ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          {showCards ? '❌ 隐藏组件' : '✅ 显示组件（开始测试）'}
        </button>
      </div>
      
      {showCards && (
        <div>
          {Array.from({ length: componentCount }, (_, i) => (
            <PostCard key={i} cardNumber={i + 1} />
          ))}
          
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: getRequestCount('/api/posts') === 1 ? '#4CAF50' : '#f44336',
            color: 'white',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {getRequestCount('/api/posts') === 1 
              ? `✅ 测试通过！只发送了 1 次请求，${componentCount} 个组件共享缓存` 
              : `❌ 测试失败！发送了 ${getRequestCount('/api/posts')} 次请求，应该只发送 1 次`}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2196F3' }}>🚀 简易版 SWR 示例</h1>
      
      <hr style={{ margin: '30px 0' }} />
      <CacheTest />
      
      <hr style={{ margin: '30px 0' }} />
      <Profile />
      
      <hr style={{ margin: '30px 0' }} />
      <MyProjects />
      
      <hr style={{ margin: '30px 0' }} />
      <ConditionalFetch />
      
      <hr style={{ margin: '30px 0' }} />
      <OptimisticUpdate />
      
      <hr style={{ margin: '30px 0' }} />
      <SWRConfig value={{ 
        onSuccess: (data) => console.log('✅ 全局成功回调:', data),
        onError: (error) => console.error('❌ 全局错误回调:', error)
      }}>
        <Dashboard />
      </SWRConfig>
    </div>
  );
}

export default App;
