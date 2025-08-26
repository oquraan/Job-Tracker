import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null };

const UserInfoSlice = createSlice({
  name: "UserInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUserInfo, clearUser } = UserInfoSlice.actions;

export default UserInfoSlice.reducer;
