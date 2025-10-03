"use client";

import { ReactNode, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "./auth-context";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token && window.location.pathname !== "/signup")
      router.replace("/login");
  }, [loading, token, router]);

  if (loading || !token) return null;

  return <>{children}</>;
}
