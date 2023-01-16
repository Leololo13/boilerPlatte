import { createSlice } from '@reduxjs/toolkit';

import {
  loginUser,
  registerUser,
  auth,
  gooleLoginUser,
} from '../_actions/user_action';

const initialState = {};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      return { ...state, LoginSuccess: payload };
    });

    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      return { ...state, RegisterSuccess: payload };
    });
    builder.addCase(auth.fulfilled, (state, { payload }) => {
      return { ...state, userData: payload };
    });
    builder.addCase(gooleLoginUser.fulfilled, (state, { payload }) => {
      return { ...state, userData: payload };
    });
  },
});

export default userSlice;
