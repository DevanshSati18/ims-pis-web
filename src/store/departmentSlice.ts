import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export interface Department {
  _id: string;
  name: string;
  key: string;
}

export const fetchDepartments = createAsyncThunk(
  "departments/fetch",
  async () => {
    const res = await api.get("/departments");
    return res.data as Department[];
  }
);

const departmentSlice = createSlice({
  name: "departments",
  initialState: [] as Department[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDepartments.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export default departmentSlice.reducer;
