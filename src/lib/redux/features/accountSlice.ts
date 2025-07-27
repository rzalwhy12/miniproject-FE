import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IAccountState extends IAccount {
    isLogin: boolean
}

const initialState: IAccountState = {
    name: "",
    username: "",
    email: "",
    profileImage: "",
    gender: "",
    birthDate: "",
    isLogin: false
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IAccount>) => {
            state.name = action.payload.name;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.profileImage = action.payload.profileImage;
            state.gender = action.payload.gender;
            state.birthDate = action.payload.birthDate;
            state.isLogin = true;
        },
        logout: (state) => {
            state = state
        }
    }
});

export const { login, logout } = accountSlice.actions;
export default accountSlice.reducer;