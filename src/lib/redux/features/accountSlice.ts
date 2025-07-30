import { IAccount } from '@/types/accounts.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAccountState extends IAccount {
  isLogin: boolean;
}

const initialState: IAccountState = {
  name: '',
  username: '',
  isLogin: false
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<IAccount>) => {
      Object.assign(state, action.payload);
      state.isLogin = true;
    },
    userOut: () => {
      return { ...initialState };
    }
  }
});

export const { signIn, userOut } = accountSlice.actions;
export default accountSlice.reducer;
