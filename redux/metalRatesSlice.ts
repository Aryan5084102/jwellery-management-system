import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { MetalRates, fetchMetalRates, defaultRates } from '../lib/metalRates';

interface MetalRatesState {
  rates: MetalRates;
  loading: boolean;
  error: string | null;
  lastFetchTime: number;
  autoRefreshEnabled: boolean;
}

const initialState: MetalRatesState = {
  rates: defaultRates,
  loading: false,
  error: null,
  lastFetchTime: 0,
  autoRefreshEnabled: true,
};

// Async thunk for fetching metal rates
export const fetchRatesAsync = createAsyncThunk(
  'metalRates/fetchRates',
  async (_, { rejectWithValue }) => {
    try {
      const rates = await fetchMetalRates();
      return rates;
    } catch (error) {
      return rejectWithValue('Failed to fetch metal rates');
    }
  }
);

const metalRatesSlice = createSlice({
  name: 'metalRates',
  initialState,
  reducers: {
    setRates: (state, action: PayloadAction<MetalRates>) => {
      state.rates = action.payload;
      state.lastFetchTime = Date.now();
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefreshEnabled = action.payload;
    },
    updateManualRate: (
      state,
      action: PayloadAction<{ type: 'gold' | 'silver'; market: 'mcx' | 'local'; rate: number }>
    ) => {
      const { type, market, rate } = action.payload;
      if (type === 'gold') {
        state.rates.gold[market] = rate;
      } else {
        state.rates.silver[market] = rate;
      }
      state.rates.lastUpdated = new Date().toISOString();
      state.rates.source = 'Manual Update';
      state.rates.isMock = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRatesAsync.fulfilled, (state, action) => {
        state.rates = action.payload;
        state.lastFetchTime = Date.now();
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRatesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setRates,
  setLoading,
  setError,
  setAutoRefresh,
  updateManualRate,
} = metalRatesSlice.actions;

export default metalRatesSlice.reducer;

// Selector hooks
export const selectMetalRates = (state: { metalRates: MetalRatesState }) => 
  state.metalRates.rates;

export const selectRatesLoading = (state: { metalRates: MetalRatesState }) => 
  state.metalRates.loading;

export const selectRatesError = (state: { metalRates: MetalRatesState }) => 
  state.metalRates.error;

export const selectLastFetchTime = (state: { metalRates: MetalRatesState }) => 
  state.metalRates.lastFetchTime;

