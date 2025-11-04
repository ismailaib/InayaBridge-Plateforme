import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className='p-4 sm:p-6 lg:p-8'>
        {children}
      </div>
    </div>
  );
}