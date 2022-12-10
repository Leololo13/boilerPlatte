import { createSlice } from '@reduxjs/toolkit';
import { Writer } from '../_actions/user_action';

const initialState = {
  WriteSuccess: {},
};
const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(Writer.fulfilled, (state, { payload }) => {
      state.WriteSuccess = payload;
    });
  },
});

export default listSlice;
