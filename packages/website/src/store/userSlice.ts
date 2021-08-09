import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { User } from "../types";

interface UserState {
  loading: boolean;
  user: User;
}

const initialState: UserState = {
	loading: true,
	user: null
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setLoading: (state: UserState, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setUser: (state: UserState, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		reset: () => initialState
	}
});

export const { setLoading, setUser, reset } = userSlice.actions;
export const selectUser = (state: RootState): UserState => state.userReducer;

export default userSlice.reducer;
