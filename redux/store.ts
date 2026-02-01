import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './stockSlice';
import lendingReducer from './lendingSlice';
import billingReducer from './billingSlice';
import partyReducer from './partySlice';
import transactionReducer from './transactionSlice';
import metalRatesReducer from './metalRatesSlice';

export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    lending: lendingReducer,
    billing: billingReducer,
    party: partyReducer,
    transaction: transactionReducer,
    metalRates: metalRatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

