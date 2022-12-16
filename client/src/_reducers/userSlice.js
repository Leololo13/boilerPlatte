import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { loginUser, registerUser } from '../_actions/user_action';

const initialState = {
  LoginSuccess: {},
  RegisterSuccess: {},
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      console.log(state);
      state.LoginSuccess = payload;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      console.log(state);
      state.RegisterSuccess = payload;
    });
  },
});

export default userSlice;
