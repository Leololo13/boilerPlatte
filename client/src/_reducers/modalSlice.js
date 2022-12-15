import { createSlice } from '@reduxjs/toolkit';
import { Writer } from '../_actions/user_action';

const initialState = {
  modalState: false,
};
const listSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {},
});

export default listSlice;
