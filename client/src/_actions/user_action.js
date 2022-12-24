import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  LOGIN_USER,
  REGISTER_USER,
  WRITE_USER,
  AUTH_USER,
  COMMENT_USER,
} from '../_reducers/type';

export const loginUser = createAsyncThunk(LOGIN_USER, async (data) => {
  return axios.post('/api/user/login', data).then((response) => response.data);
});

export const registerUser = createAsyncThunk(REGISTER_USER, async (data) => {
  return axios
    .post('/api/user/register', data)
    .then((response) => response.data);
});

export const Writer = createAsyncThunk(WRITE_USER, async (data) => {
  return axios.post('/api/list/write', data).then((response) => response.data);
});

export const auth = createAsyncThunk(AUTH_USER, async () => {
  return axios.get('/api/user/auth').then((response) => {
    return response.data;
  });
});

export const CommentWrite = createAsyncThunk(COMMENT_USER, async (data) => {
  return axios
    .post('/api/post/comment/:id', data)
    .then((response) => response.data);
});
