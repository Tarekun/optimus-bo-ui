import { ReactNode } from 'react';

export const DRAWER_WIDTH = 360;

export interface PageLink {
  label: string;
  url: string;
  icon?: ReactNode;
}

export function shouldHighlight(url: string, pathname: string) {
  const isHome = url === '/' || url === '';
  // la logica è statsWith per funzionare "ad albero"
  // nel caso della home si test l'uguaglianza perché tutti i percorsi iniziano con '/'
  return isHome ? url === pathname : pathname.startsWith(url);
}

export type NavbarStyling = 'solid' | 'transparent';
