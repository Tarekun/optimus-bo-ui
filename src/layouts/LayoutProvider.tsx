import { ChildrenType } from '../core/types';
import DefaultLayout from './DefaultLayout';

interface LayoutProviderProps {
  children?: ChildrenType;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
