import { createContext, ReactNode } from 'react';
import { TNode } from '@native-html/render';

export const demoDescriptionContext = createContext<ReactNode>(null);
export const demoControlsContext = createContext<ReactNode>(null);
export const demoNavigatorContext = createContext<ReactNode>(null);
export const demoStateContext = createContext<{ html: string; ttree?: TNode }>({
  html: '',
  ttree: undefined
});
