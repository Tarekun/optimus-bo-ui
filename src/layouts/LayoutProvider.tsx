import { PropsWithChildren } from 'react';
import DefaultLayout from './DefaultLayout';

export default function LayoutProvider({ children }: PropsWithChildren) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
