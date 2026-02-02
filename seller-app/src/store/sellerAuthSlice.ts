import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Seller, SellerAuthSliceState } from '@3asoftwares/types';

const initialState: SellerAuthSliceState = {
  seller: null,
  token: null,
  isAuthenticated: false,
};

const sellerAuthSlice = createSlice({
  name: 'sellerAuth',
  initialState,
  reducers: {
    setSeller: (state, action: PayloadAction<{ seller: Partial<Seller>; token: string }>) => {
      state.seller = action.payload.seller as any;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.seller = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setSeller, logout } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
