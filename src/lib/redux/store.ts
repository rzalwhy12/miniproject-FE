import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/accountSlice';
import loadingReducer from './features/loadingSlice';
export const store = configureStore({
  reducer: {
    account: accountReducer,
    loading: loadingReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
