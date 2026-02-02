// Mock for 3asoftwares/types
export interface AdminUser {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: 'admin';
  emailVerified?: boolean;
  permissions?: string[];
}

export interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  language: string;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setLanguage: (lang: string) => void;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  sellerId: string;
  status: 'active' | 'inactive' | 'draft';
}

export interface Order {
  _id: string;
  customerId: string;
  sellerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxUsageCount?: number;
  currentUsageCount: number;
  expiryDate: string;
  isActive: boolean;
}

export default {};
