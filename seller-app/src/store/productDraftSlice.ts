import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProductDraft, ProductDraftState } from '@3asoftwares/types';

const initialState: ProductDraftState = {
  draft: null,
};

const productDraftSlice = createSlice({
  name: 'productDraft',
  initialState,
  reducers: {
    setDraft: (state, action: PayloadAction<ProductDraft>) => {
      state.draft = action.payload;
    },
    clearDraft: (state) => {
      state.draft = null;
    },
  },
});

export const { setDraft, clearDraft } = productDraftSlice.actions;
export default productDraftSlice.reducer;
