import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Loan {
  id: number;
  borrower: string;
  loanType: string;
  ornamentName: string;
  weight: number;
  purity: string;
  amount: number;
  interest: number;
  status: 'active' | 'closed';
  createdAt?: string;
}

// Interface for addLoan input (without status and createdAt)
export interface AddLoanInput {
  id: number;
  borrower: string;
  loanType: string;
  ornamentName: string;
  weight: number;
  purity: string;
  amount: number;
  interest: number;
}

interface LendingState {
  loans: Loan[];
}

const initialState: LendingState = {
  loans: [],
};

const lendingSlice = createSlice({
  name: 'lending',
  initialState,
  reducers: {
    addLoan: (state, action: PayloadAction<AddLoanInput>) => {
      state.loans.push({
        ...action.payload,
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    },
    closeLoan: (state, action: PayloadAction<number>) => {
      const loan = state.loans.find(l => l.id === action.payload);
      if (loan) {
        loan.status = 'closed';
      }
    },
    deleteLoan: (state, action: PayloadAction<number>) => {
      state.loans = state.loans.filter(l => l.id !== action.payload);
    },
  },
});

export const { addLoan, closeLoan, deleteLoan } = lendingSlice.actions;
export default lendingSlice.reducer;

