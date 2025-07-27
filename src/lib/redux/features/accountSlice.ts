import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAccountState extends IAccount {
  isLogin: boolean;
}

const initialState: IAccountState = {
  name: '',
  username: '',
  email: '',
  profileImage: '',
  gender: '',
  birthDate: '',
  isLogin: false
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IAccount>) => {
      Object.assign(state, action.payload);
    },
    logout: () => {
      initialState;
    }
  }
});

export const { login, logout } = accountSlice.actions;
export default accountSlice.reducer;
