
'use client';

import { AuthProvider } from '@/lib/auth-context';
import { QueryProvider } from './QueryProvider';
import { Toaster } from './Toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
    </QueryProvider>
  );
}
