import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StockItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  metalType: string;
  purity: string;
  weight: number;
  makingCharge: number;
  category: string;
  createdAt?: string;
}

interface StockState {
  items: StockItem[];
}

const initialState: StockState = {
  items: [],
};

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    addStock: (state, action: PayloadAction<StockItem>) => {
      state.items.push({
        ...action.payload,
        createdAt: new Date().toISOString(),
      });
    },
    updateStock: (state, action: PayloadAction<StockItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteStock: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addStock, updateStock, deleteStock } = stocksSlice.actions;
export default stocksSlice.reducer;

