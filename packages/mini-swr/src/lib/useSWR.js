import { useEffect, useReducer, useCallback, useContext, useRef } from 'react';
import { SWRConfigContext } from './SWRConfig';

// 全局缓存
const cache = new Map();
const listeners = new Map();

// 初始状态
const initialState = {
  data: undefined,
  error: undefined,
  isValidating: false
};

// reducer
function swrReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.data, error: undefined, isValidating: false };
    case 'SET_ERROR':
      return { ...state, error: action.error, isValidating: false };
    case 'SET_VALIDATING':
      return { ...state, isValidating: action.isValidating };
    default:
      return state;
  }
}

export function useSWR(key, fetcher, options = {}) {
  // 合并全局配置和局部配置
  const globalConfig = useContext(SWRConfigContext);
  const config = { ...globalConfig, ...options };
  
  // 处理 key（支持函数和条件取数）
  let resolvedKey;
  try {
    resolvedKey = typeof key === 'function' ? key() : key;
  } catch (err) {
    resolvedKey = null;
  }

  const [state, dispatch] = useReducer(swrReducer, initialState, () => {
    // 初始化时从缓存读取
    const cachedData = cache.get(resolvedKey);
    return cachedData ? { ...initialState, data: cachedData } : initialState;
  });

  const fetcherRef = useRef(fetcher || config.fetcher);
  const configRef = useRef(config);
  fetcherRef.current = fetcher || config.fetcher;
  configRef.current = config;

  // 取数函数
  const revalidate = useCallback(async () => {
    if (!resolvedKey || !fetcherRef.current) return;

    dispatch({ type: 'SET_VALIDATING', isValidating: true });

    try {
      const data = await fetcherRef.current(resolvedKey);
      
      // 更新缓存
      cache.set(resolvedKey, data);
      
      dispatch({ type: 'SET_DATA', data });
      
      // 通知所有监听者（除了当前组件）
      const keyListeners = listeners.get(resolvedKey) || [];
      keyListeners.forEach(listener => listener(data));
      
      // 成功回调
      if (configRef.current.onSuccess) {
        configRef.current.onSuccess(data, resolvedKey, configRef.current);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error });
      
      // 错误回调
      if (configRef.current.onError) {
        configRef.current.onError(error, resolvedKey, configRef.current);
      }
    }
  }, [resolvedKey]);

  // 注册监听器（用于跨组件同步数据）
  useEffect(() => {
    if (!resolvedKey) return;

    const listener = (data) => {
      // 只有当数据与当前状态不同时才更新
      dispatch({ type: 'SET_DATA', data });
    };

    if (!listeners.has(resolvedKey)) {
      listeners.set(resolvedKey, []);
    }
    listeners.get(resolvedKey).push(listener);

    return () => {
      const keyListeners = listeners.get(resolvedKey);
      if (keyListeners) {
        const index = keyListeners.indexOf(listener);
        if (index > -1) {
          keyListeners.splice(index, 1);
        }
      }
    };
  }, [resolvedKey]);

  // 自动取数（只在 key 变化或首次挂载时执行）
  const hasFetchedRef = useRef(false);
  
  useEffect(() => {
    if (!resolvedKey) return;

    // 检查是否已有缓存
    const cachedData = cache.get(resolvedKey);
    if (cachedData && !hasFetchedRef.current) {
      // 如果有缓存且是首次加载，不需要重新取数
      hasFetchedRef.current = true;
      return;
    }

    hasFetchedRef.current = true;
    revalidate();
  }, [resolvedKey, revalidate]);

  return {
    data: state.data,
    error: state.error,
    isValidating: state.isValidating,
    mutate: revalidate
  };
}

// 手动触发重新取数或更新缓存
export function mutate(key, data) {
  if (data !== undefined) {
    // 更新缓存
    cache.set(key, data);
    
    // 通知所有监听者
    const keyListeners = listeners.get(key) || [];
    keyListeners.forEach(listener => listener(data));
  }
}
