// ================== useImmer ==================
import { useState, useCallback } from 'react';
import { produce } from './mini-immer';

type Recipe<T> = (draft: T) => void;
type Updater<T> = (recipe: Recipe<T>) => void;

export function useImmer<T>(initialState: T): [T, Updater<T>] {
  const [state, setState] = useState(initialState);
  
  const update = useCallback((fn: Recipe<T>) => {
    setState(prev => produce(prev, fn));
  }, []);
  
  return [state, update];
}
