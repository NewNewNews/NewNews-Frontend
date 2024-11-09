// hooks/useAuth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (credentials: {
    email: string;
    hashedPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const apiClient = axios.create({
  withCredentials: true,
});

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,

      login: async (credentials) => {
        try {
          const response = await apiClient.post("/api/login", credentials);

          // The backend should set the JWT cookie automatically

          // Fetch user data
          const userResponse = await apiClient.get("/api/protected/me");
          set({ user: userResponse.data });

          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Login failed");
          }
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.post("/api/logout");
          set({ user: null });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      checkAuth: async () => {
        try {
          const response = await apiClient.get("/api/protected/me");
          set({ user: response.data, isLoading: false });
        } catch (error) {
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);
