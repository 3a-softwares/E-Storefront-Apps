import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from './client';
import {
  CreateProductInput,
  UpdateProductInput,
  CreateCouponInput,
  UpdateCouponInput,
  PaymentStatus,
  OrderStatus,
} from '@3asoftwares/types';
import {
  DASHBOARD_STATS_QUERY,
  GET_USERS_QUERY,
  GET_PRODUCTS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_ORDERS_QUERY,
  GET_ORDER_QUERY,
  GET_COUPONS_QUERY,
  UPDATE_USER_ROLE_MUTATION,
  DELETE_USER_MUTATION,
  CREATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
  UPDATE_ORDER_STATUS_MUTATION,
  UPDATE_PAYMENT_STATUS_MUTATION,
  CANCEL_ORDER_MUTATION,
  CREATE_COUPON_MUTATION,
  UPDATE_COUPON_MUTATION,
  DELETE_COUPON_MUTATION,
} from '@3asoftwares/utils/client';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      return graphqlRequest(DASHBOARD_STATS_QUERY);
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

export const useUsers = (page: number = 1, limit: number = 10, search?: string, role?: string) => {
  return useQuery({
    queryKey: ['users', page, limit, search, role],
    queryFn: async () => {
      return graphqlRequest(GET_USERS_QUERY, { page, limit, search, role });
    },
  });
};

export const useProducts = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string
) => {
  return useQuery({
    queryKey: ['products', page, limit, search, category],
    queryFn: async () => {
      return graphqlRequest(GET_PRODUCTS_QUERY, {
        page,
        limit,
        search,
        category,
        includeInactive: true,
      });
    },
  });
};

export const useOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: async () => {
      return graphqlRequest(GET_ORDERS_QUERY, { page, limit });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      return graphqlRequest(UPDATE_ORDER_STATUS_MUTATION, { id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return graphqlRequest(DELETE_USER_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      return graphqlRequest(UPDATE_USER_ROLE_MUTATION, { id, role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      return graphqlRequest(CREATE_PRODUCT_MUTATION, { input });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateProductInput }) => {
      return graphqlRequest(UPDATE_PRODUCT_MUTATION, { id, input });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });

      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return graphqlRequest(DELETE_PRODUCT_MUTATION, { id });
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return graphqlRequest(GET_CATEGORIES_QUERY);
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      return graphqlRequest(UPDATE_PAYMENT_STATUS_MUTATION, { id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return graphqlRequest(CANCEL_ORDER_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      return graphqlRequest(GET_ORDER_QUERY, { id });
    },
    enabled: !!id,
  });
};

export const useCoupons = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  isActive?: boolean
) => {
  return useQuery({
    queryKey: ['coupons', page, limit, search, isActive],
    queryFn: async () => {
      return graphqlRequest(GET_COUPONS_QUERY, { page, limit, search, isActive });
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCouponInput) => {
      return graphqlRequest(CREATE_COUPON_MUTATION, { input });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateCouponInput }) => {
      return graphqlRequest(UPDATE_COUPON_MUTATION, { id, input });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return graphqlRequest(DELETE_COUPON_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};
