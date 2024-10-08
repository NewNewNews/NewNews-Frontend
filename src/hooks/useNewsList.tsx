import { create } from 'zustand';

interface NewsState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useNewsList = create<NewsState>((set) => ({
  searchTerm: '',
  setSearchTerm: (term: string) => set({ searchTerm: term }),
}));
