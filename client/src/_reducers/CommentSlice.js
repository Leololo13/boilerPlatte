import { createSlice } from '@reduxjs/toolkit';
import { CommentWrite } from '../_actions/user_action';

const initialState = {};
const listSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CommentWrite.fulfilled, (state, { payload }) => {
      return { ...state, WriteSuccess: payload };
    });
  },
});

export default listSlice;
