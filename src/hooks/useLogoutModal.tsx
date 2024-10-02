// File: hooks/useLogoutModal.ts
import { create } from "zustand";

interface LogoutModalStore {
  isLogoutOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useLogoutModal = create<LogoutModalStore>((set) => ({
  isLogoutOpen: false,
  onOpen: () => set({ isLogoutOpen: true }),
  onClose: () => set({ isLogoutOpen: false }),
}));

export default useLogoutModal;
