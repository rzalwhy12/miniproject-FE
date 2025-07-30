import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: false,
  reducers: {
    showLoading: () => true,
    hideLoading: () => false
  }
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
