import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PartyType = 'customer' | 'vendor' | 'both';

export interface Party {
  id: number;
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  openingBalance: number;
  balanceType: 'receivable' | 'payable';
  type: PartyType;
  createdAt: string;
}

interface PartyState {
  parties: Party[];
}

const initialState: PartyState = {
  parties: [],
};

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    addParty: (state, action: PayloadAction<Party>) => {
      state.parties.push(action.payload);
    },
    updateParty: (state, action: PayloadAction<Party>) => {
      const index = state.parties.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.parties[index] = action.payload;
      }
    },
    deleteParty: (state, action: PayloadAction<number>) => {
      state.parties = state.parties.filter(p => p.id !== action.payload);
    },
  },
});

export const { addParty, updateParty, deleteParty } = partySlice.actions;
export default partySlice.reducer;

