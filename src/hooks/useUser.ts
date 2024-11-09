// hooks/useUser.ts
import { useAuth } from "./useAuth";

export const useUser = () => {
  const { user, isLoading } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};
