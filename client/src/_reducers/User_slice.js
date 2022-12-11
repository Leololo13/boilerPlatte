import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loginSuccess: {},
  success: {},
};

export const LoginUser = createAsyncThunk('LOGIN_USER', async (data) => {
  return axios.post('/api/user/login', data).then((response) => response.data);
});

export const RegisterUser = createAsyncThunk('Register_USER', async (data) => {
  return axios
    .post('/api/user/register', data)
    .then((response) => response.data);
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LoginUser.fulfilled, (state, { payload }) => {
      state.loginSuccess = payload;
      state.name = payload;
    });
    builder.addCase(RegisterUser.fulfilled, (state, { payload }) => {
      state.success = payload;
    });
  },
});

export default userSlice;
