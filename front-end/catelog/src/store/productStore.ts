import { create } from 'zustand';
import type { ProductState } from '../types';
import { getProducts, getUniqueFilterOptions } from '../api/productService';

export const useProductStore = create<ProductState>((set, get) => ({
  products: [], // Initialize with empty array, products will be fetched
  availableCategories: [],
  availableTags: [],
  filters: {
    category: 'All Categories',
    priceRange: { min: 0, max: 1000 },
    tags: [],
    competitors: [],
    search: '',
  },
  setCategory: (category) => set((state) => ({ filters: { ...state.filters, category } })),
  setPriceRange: (min, max) =>
    set((state) => ({ filters: { ...state.filters, priceRange: { min, max } } })),
  addTag: (tag) =>
    set((state) => ({
      filters: { ...state.filters, tags: [...state.filters.tags, tag] },
    })),
  removeTag: (tag) =>
    set((state) => ({
      filters: { ...state.filters, tags: state.filters.tags.filter((t) => t !== tag) },
    })),
  addCompetitor: (competitor) =>
    set((state) => ({
      filters: { ...state.filters, competitors: [...state.filters.competitors, competitor] },
    })),
  removeCompetitor: (competitor) =>
    set((state) => ({
      filters: { ...state.filters, competitors: state.filters.competitors.filter((c) => c !== competitor) },
    })),
  clearFilters: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        category: 'All Categories',
        priceRange: { min: 0, max: 1000 },
        tags: [],
        competitors: [],
        search: '',
      },
    })),
  setSearch: (search: string) => set((state) => ({ filters: { ...state.filters, search } })),
  fetchProducts: async () => {
    try {
      const currentFilters = get().filters; // Get current filters from state
      const data = await getProducts(currentFilters.search, currentFilters.category, currentFilters.tags);
      set({ products: data });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Optionally, set an error state here
    }
  },
  fetchFilterOptions: async () => {
    try {
      const { categories, tags } = await getUniqueFilterOptions();
      set({ availableCategories: categories, availableTags: tags });
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  },
}));
