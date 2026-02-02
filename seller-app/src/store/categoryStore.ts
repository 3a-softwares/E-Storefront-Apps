import { create } from 'zustand';
import { categoryApi } from '../api/client';

interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getCategoryOptions: () => { value: string; label: string }[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    const { categories, isLoading } = get();

    // Only fetch if categories is empty and not already loading
    if (isLoading) return;
    if (categories.length > 0) return;

    try {
      set({ isLoading: true, error: null });
      const response = await categoryApi.getCategories();
      const fetchedCategories = response?.data?.data?.categories || [];
      set({
        categories: fetchedCategories,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  getCategoryOptions: () => {
    const { categories } = get();
    return categories.map((cat) => ({ value: cat.name, label: cat.name }));
  },
}));
