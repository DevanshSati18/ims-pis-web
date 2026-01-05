import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
    },
    stopLoading(state) {
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, stopLoading } = authSlice.actions;
export default authSlice.reducer;
