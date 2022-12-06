import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from './User_slice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export const store = configureStore({
  reducer: { rootReducer },
});
