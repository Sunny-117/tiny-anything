import { createContext } from 'react';

export const SWRConfigContext = createContext({});

export function SWRConfig({ value, children }) {
  return (
    <SWRConfigContext.Provider value={value}>
      {children}
    </SWRConfigContext.Provider>
  );
}
