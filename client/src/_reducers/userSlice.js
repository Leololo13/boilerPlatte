import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../_actions/user_action';

const initialState = {
  hi: 'no',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      return { ...state, loginSuccess: payload, hi: 'hello' };
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      return { ...state, RegisterSuccess: payload };
    });
  },
});

console.log(userSlice.reducer, 'user ');
export default userSlice;
