import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export interface Department {
  key: string;
  name: string;
}

export const fetchDepartmentsAdmin = createAsyncThunk(
  "adminDepartments/fetch",
  async () => {
    const res = await api.get<Department[]>("/departments");
    return res.data;
  }
);

export const createDepartmentAdmin = createAsyncThunk(
  "adminDepartments/create",
  async (payload: { key: string; name: string }) => {
    const res = await api.post<Department>("/departments", payload);
    return res.data;
  }
);

interface AdminDepartmentState {
  items: Department[];
  loading: boolean;
}

const initialState: AdminDepartmentState = {
  items: [],
  loading: false,
};

const adminDepartmentSlice = createSlice({
  name: "adminDepartments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentsAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartmentsAdmin.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(createDepartmentAdmin.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default adminDepartmentSlice.reducer;
