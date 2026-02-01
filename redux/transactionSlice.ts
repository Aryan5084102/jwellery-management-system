import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransactionType = 'receipt' | 'payment' | 'journal';
export type AccountType = 'cash' | 'bank' | 'party' | 'expense' | 'income';

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  accountType: AccountType;
  partyId?: number;
  partyName?: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  reference: string;
  createdAt: string;
}

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<number>) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;

