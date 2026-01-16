import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { User } from "@/types/auth";

export const fetchUserPermissions = createAsyncThunk(
  "adminPermissions/fetch",
  async (userId: string) => {
    const res = await api.get<User>(`/users/${userId}`);
    return res.data;
  }
);

export const saveUserPermissions = createAsyncThunk(
  "adminPermissions/save",
  async (payload: {
    userId: string;
    visibleSubDepartments: string[];
  }) => {
    await api.put(`/users/${payload.userId}/permissions`, {
      visibleSubDepartments: payload.visibleSubDepartments,
    });
    return payload.visibleSubDepartments;
  }
);

interface PermissionState {
  current: string[];
  loading: boolean;
}

const initialState: PermissionState = {
  current: [],
  loading: false,
};

const adminPermissionSlice = createSlice({
  name: "adminPermissions",
  initialState,
  reducers: {
    togglePermission(state, action) {
      const token = action.payload;
      if (state.current.includes(token)) {
        state.current = state.current.filter((t) => t !== token);
      } else {
        state.current.push(token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPermissions.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchUserPermissions.fulfilled, (s, a) => {
        s.current = a.payload.visibleSubDepartments || [];
        s.loading = false;
      })
      .addCase(saveUserPermissions.fulfilled, (s, a) => {
        s.current = a.payload;
      });
  },
});

export const { togglePermission } =
  adminPermissionSlice.actions;

export default adminPermissionSlice.reducer;
