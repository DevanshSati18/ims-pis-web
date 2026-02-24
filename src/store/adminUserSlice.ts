import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { User } from "@/types/auth";

export interface AdminUser extends User {
  isActive?: boolean;
}

export const fetchUsersAdmin = createAsyncThunk(
  "adminUsers/fetch",
  async () => {
    const res = await api.get<AdminUser[]>("/users");
    return res.data;
  }
);

export const createUserAdmin = createAsyncThunk(
  "adminUsers/create",
  async (payload: {
    email: string;
    password: string;
    role: "admin" | "user";
  }) => {
    const res = await api.post<AdminUser>("/users", payload);
    return res.data;
  }
);

export const resetPasswordAdmin = createAsyncThunk(
  "adminUsers/resetPassword",
  async (payload: { userId: string; password: string }) => {
    await api.post(`/users/${payload.userId}/reset-password`, {
      password: payload.password,
    });
    return payload.userId;
  }
);

export const toggleUserStatusAdmin = createAsyncThunk(
  "adminUsers/toggleStatus",
  async (payload: { userId: string; isActive: boolean }) => {
    await api.patch(`/users/${payload.userId}/status`, {
      isActive: payload.isActive,
    });
    return payload;
  }
);

interface AdminUserState {
  items: AdminUser[];
  loading: boolean;
}

const initialState: AdminUserState = {
  items: [],
  loading: false,
};

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAdmin.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchUsersAdmin.fulfilled, (s, a) => {
        s.items = a.payload;
        s.loading = false;
      })
      .addCase(createUserAdmin.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(toggleUserStatusAdmin.fulfilled, (s, a) => {
        const user = s.items.find(
          (u) => u.id === a.payload.userId
        );
        if (user) user.isActive = a.payload.isActive;
      }).addCase(changeMobileAdmin.fulfilled, (state, action) => {
        const user = state.items.find((u: unknown) => (u.id || u._id) === action.payload.userId);
        if (user) {
          (user as unknown).mobile = action.payload.mobile;
        }
      });
  },
});
export const changeMobileAdmin = createAsyncThunk(
  "adminUsers/changeMobile",
  async (payload: { userId: string; mobile: string }, { rejectWithValue }) => {
    try {
      // Ensure this endpoint matches your backend route
      const res = await api.put(`/users/${payload.userId}/mobile`, { mobile: payload.mobile });
      return { userId: payload.userId, mobile: payload.mobile };
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data || "Failed to update mobile number");
    }
  }
);
export default adminUserSlice.reducer;
