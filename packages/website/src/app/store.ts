import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../store/userSlice';
import jobsReducer from '../store/jobsSlice';
export const store = configureStore({
  reducer: {
    userReducer,
    jobsReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
