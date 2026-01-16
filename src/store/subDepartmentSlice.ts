import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { SubDepartment } from "@/types/schema"; // ✅ USE SHARED TYPE

export const fetchSubDepartments = createAsyncThunk(
  "subDepartments/fetch",
  async (departmentKey: string) => {
    const res = await api.get<SubDepartment[]>(
      `/sub-departments/${departmentKey}`
    );
    return { departmentKey, items: res.data };
  }
);

type SubDepartmentState = Record<string, SubDepartment[]>;

const initialState: SubDepartmentState = {};

const subDepartmentSlice = createSlice({
  name: "subDepartments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubDepartments.fulfilled, (state, action) => {
      state[action.payload.departmentKey] = action.payload.items;
    });
  },
});

export default subDepartmentSlice.reducer;
