import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export interface SubDepartment {
  _id: string;
  name: string;
  key: string;
  departmentKey: string;
}

export const fetchSubDepartments = createAsyncThunk(
  "subDepartments/fetch",
  async (departmentKey: string) => {
    const res = await api.get(`/sub-departments/${departmentKey}`);
    return {
      departmentKey,
      data: res.data as SubDepartment[],
    };
  }
);

interface State {
  [departmentKey: string]: SubDepartment[];
}

const subDepartmentSlice = createSlice({
  name: "subDepartments",
  initialState: {} as State,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubDepartments.fulfilled, (state, action) => {
      state[action.payload.departmentKey] = action.payload.data;
    });
  },
});

export default subDepartmentSlice.reducer;
