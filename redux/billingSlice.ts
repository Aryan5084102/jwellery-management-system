import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Bill {
  id: number;
  customer: string;
  customerGstin: string;
  items: string;
  hsnCodes: string;
  subtotal: number;
  gstRate: number;
  totalGst: number;
  total: number;
  createdAt: string;
}

interface BillingState {
  bills: Bill[];
}

const initialState: BillingState = {
  bills: [],
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addBill: (state, action: PayloadAction<Bill>) => {
      state.bills.push(action.payload);
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    deleteBill: (state, action: PayloadAction<number>) => {
      state.bills = state.bills.filter(b => b.id !== action.payload);
    },
  },
});

export const { addBill, updateBill, deleteBill } = billingSlice.actions;
export default billingSlice.reducer;

