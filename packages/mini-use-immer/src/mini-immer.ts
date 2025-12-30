// ================== Immer Core ==================

const DRAFT_STATE = Symbol('draft-state');

function isObject(v: any): boolean {
  return v !== null && typeof v === 'object';
}

interface State {
  base: any;
  copy: any;
  parent: State | null;
  modified: boolean;
  drafts: Map<string | number | symbol, any>;
}

function createState(base: any, parent: State | null): State {
  return {
    base,
    copy: null,
    parent,
    modified: false,
    drafts: new Map()
  };
}

function getCurrent(state: State): any {
  return state.copy || state.base;
}

function markChanged(state: State): void {
  if (!state.modified) {
    state.modified = true;
    state.copy = Array.isArray(state.base)
      ? state.base.slice()
      : { ...state.base };
    if (state.parent) markChanged(state.parent);
  }
}

function createDraft(base: any, parent: State | null): any {
  const state = createState(base, parent);
  
  return new Proxy(base, {
    get(_: any, key: string | symbol) {
      if (key === DRAFT_STATE) return state;
      
      const value = getCurrent(state)[key];
      if (!isObject(value)) return value;
      
      if (!state.drafts.has(key)) {
        state.drafts.set(key, createDraft(value, state));
      }
      return state.drafts.get(key);
    },
    
    set(_: any, key: string | symbol, value: any) {
      markChanged(state);
      state.copy[key] = value;
      return true;
    }
  });
}

function finalize(draft: any): any {
  const state = draft[DRAFT_STATE] as State;
  if (!state.modified) return state.base;
  
  for (const [key, child] of state.drafts) {
    state.copy[key] = finalize(child);
  }
  
  return state.copy;
}

export function produce<T>(baseState: T, recipe: (draft: T) => void): T {
  const draft = createDraft(baseState, null);
  recipe(draft);
  return finalize(draft);
}
