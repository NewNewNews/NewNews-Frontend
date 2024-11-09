// components/providers/AuthProvider.tsx
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
};
