import { createContext, ReactNode, useMemo } from 'react';

import config from 'config';
import { useLocalStorage } from 'hooks/useLocalStorage';

import { ConfigContextValue, ConfigStates } from 'types/config';

export type Props = {
  children: ReactNode;
};

export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function ConfigProvider({ children }: Props) {
  const { state, setState, setField, resetState } = useLocalStorage<ConfigStates>('berry-config-vite-ts', config);

  const memoizedValue = useMemo(() => ({ state, setState, setField, resetState }), [state, setField, setState, resetState]);

  return <ConfigContext.Provider value={memoizedValue}>{children}</ConfigContext.Provider>;
}
