import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/accountSlice';
import loadingReducer from './features/loadingSlice';
import eventFormSlice from './features/createEvenSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    loading: loadingReducer,
    createEvent: eventFormSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
