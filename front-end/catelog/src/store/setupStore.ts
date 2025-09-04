import { create } from 'zustand';

interface SetupState {
  shopifyUrl: string;
  category: string;
  seoFocus: string;
  writingTone: string;
  setShopifyUrl: (url: string) => void;
  setCategory: (category: string) => void;
  setSeoFocus: (focus: string) => void;
  setWritingTone: (tone: string) => void;
  getAllSelections: () => { shopifyUrl: string; category: string; seoFocus: string; writingTone: string };
}

export const useSetupStore = create<SetupState>((set, get) => ({
  shopifyUrl: '',
  category: '',
  seoFocus: '',
  writingTone: '',
  setShopifyUrl: (url) => set({ shopifyUrl: url }),
  setCategory: (category) => set({ category }),
  setSeoFocus: (focus) => set({ seoFocus: focus }),
  setWritingTone: (tone) => set({ writingTone: tone }),
  getAllSelections: () => ({
    shopifyUrl: get().shopifyUrl,
    category: get().category,
    seoFocus: get().seoFocus,
    writingTone: get().writingTone,
  }),
}));
