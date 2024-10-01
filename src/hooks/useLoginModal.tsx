import { create } from 'zustand';

interface LoginModalStore {
    isLoginOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useLoginModal = create<LoginModalStore>((set) => ({
    isLoginOpen: false,
    onOpen: () => set({ isLoginOpen: true }),
    onClose: () => set({ isLoginOpen: false }),
}));

export default useLoginModal;
