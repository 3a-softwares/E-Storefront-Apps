import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/store/authSlice';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Create test store
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });

interface WrapperProps {
  children: React.ReactNode;
}

// All providers wrapper
const AllTheProviders = ({ children }: WrapperProps) => {
  const queryClient = createTestQueryClient();
  const store = createTestStore({
    auth: {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

// Custom render function
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, createTestQueryClient, createTestStore };

// Mock data factories
export const mockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  isActive: true,
  isVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

export const mockProduct = (overrides = {}) => ({
  id: 'product-1',
  name: 'Test Product',
  description: 'A test product description',
  price: 999,
  category: 'Electronics',
  stock: 100,
  imageUrl: 'https://example.com/image.jpg',
  sellerId: 'seller-1',
  isActive: true,
  tags: ['test', 'product'],
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

export const mockOrder = (overrides = {}) => ({
  id: 'order-1',
  orderNumber: 'ORD-123456',
  customerId: 'customer-1',
  customerEmail: 'customer@example.com',
  items: [
    {
      productId: 'product-1',
      productName: 'Test Product',
      quantity: 2,
      price: 500,
      subtotal: 1000,
    },
  ],
  subtotal: 1000,
  tax: 180,
  shipping: 50,
  discount: 0,
  total: 1230,
  orderStatus: 'PENDING',
  paymentStatus: 'PENDING',
  paymentMethod: 'card',
  shippingAddress: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    country: 'India',
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

export const mockCoupon = (overrides = {}) => ({
  id: 'coupon-1',
  code: 'TESTCODE',
  description: 'Test coupon description',
  discountType: 'percentage',
  discount: 10,
  minPurchase: 500,
  maxDiscount: 200,
  validFrom: '2024-01-01T00:00:00.000Z',
  validTo: '2024-12-31T23:59:59.999Z',
  isActive: true,
  usageLimit: 100,
  usageCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

export const mockDashboardStats = () => ({
  totalUsers: 150,
  totalOrders: 500,
  pendingOrders: 25,
  totalRevenue: 1500000,
  completedOrders: 450,
});

export const mockPagination = (overrides = {}) => ({
  page: 1,
  limit: 10,
  total: 100,
  pages: 10,
  ...overrides,
});
