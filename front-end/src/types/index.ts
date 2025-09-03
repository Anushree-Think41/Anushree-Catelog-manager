export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  tags: string[];
}

export interface FilterState {
  category: string;
  priceRange: { min: number; max: number };
  tags: string[];
  competitors: string[];
  search: string;
}

export interface ProductState {
  products: Product[];
  filters: FilterState;
  availableCategories: string[];
  availableTags: string[];
  setCategory: (category: string) => void;
  setPriceRange: (min: number, max: number) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addCompetitor: (competitor: string) => void;
  removeCompetitor: (competitor: string) => void;
  clearFilters: () => void;
  fetchProducts: () => Promise<void>;
  fetchFilterOptions: () => Promise<void>;
  setSearch: (search: string) => void;
}
