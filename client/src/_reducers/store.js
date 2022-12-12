import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from '../_reducers/userSlice';
import listSlice from '../_reducers/listSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  list: listSlice.reducer,
});

export const store = configureStore({
  reducer: { rootReducer },
});
