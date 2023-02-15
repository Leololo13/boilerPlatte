import { createSlice } from '@reduxjs/toolkit';

import { loginUser, registerUser, auth, gooleLoginUser } from '../_actions/user_action';

const initialState = {};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      return { ...state, LoginSuccess: payload };
    });

    builder
      .addCase(registerUser.pending, (state) => {
        console.log(state);
        return { ...state, isloading: true };
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        return { ...state, isloading: false, RegisterSuccess: payload };
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
