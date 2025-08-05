import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAccountState {
  id: number;
  name: string;
  role: string;
  isLogin: boolean;
  checking: boolean;
}

const initialState: IAccountState = {
  id: 0,
  name: '',
  role: '',
  isLogin: false,
  checking: true
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    userLogin: (
      state,
      action: PayloadAction<Omit<IAccountState, 'isLogin' | 'checking'>>
    ) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.isLogin = true;
      state.checking = false;
    },
    userLogout: (state) => {
      state.id = 0;
      state.name = '';
      state.role = '';
      state.isLogin = false;
      state.checking = false;
    },
    setChecking: (state, action: PayloadAction<boolean>) => {
      state.checking = action.payload;
    }
  }
});

export const { userLogin, userLogout, setChecking } = accountSlice.actions;
export default accountSlice.reducer;
