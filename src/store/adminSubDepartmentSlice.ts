import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { SubDepartment } from "@/types/schema";

export const fetchSubDepartmentsAdmin = createAsyncThunk(
  "adminSubDepartments/fetch",
  async (departmentKey: string) => {
    const res = await api.get<SubDepartment[]>(
      `/sub-departments/${departmentKey}`
    );
    return res.data;
  }
);

export const createSubDepartmentAdmin = createAsyncThunk(
  "adminSubDepartments/create",
  async (payload: {
    departmentKey: string;
    key: string;
    name: string;
    fields: SubDepartment["fields"];
  }) => {
    const res = await api.post<SubDepartment>(
      "/sub-departments",
      payload
    );
    return res.data;
  }
);

export const deleteSubDepartmentAdmin = createAsyncThunk(
  "adminSubDepartments/delete",
  async (payload: {
    departmentKey: string;
    key: string;
  }) => {
    await api.delete(
      `/sub-departments/${payload.departmentKey}/${payload.key}`
    );
    return payload;
  }
);

interface AdminSubDepartmentState {
  items: SubDepartment[];
  loading: boolean;
}

const initialState: AdminSubDepartmentState = {
  items: [],
  loading: false,
};

const adminSubDepartmentSlice = createSlice({
  name: "adminSubDepartments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubDepartmentsAdmin.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchSubDepartmentsAdmin.fulfilled, (s, a) => {
        s.items = a.payload;
        s.loading = false;
      })
      .addCase(createSubDepartmentAdmin.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(deleteSubDepartmentAdmin.fulfilled, (s, a) => {
        s.items = s.items.filter(
          (sd) => sd.key !== a.payload.key
        );
      });
  },
});

export default adminSubDepartmentSlice.reducer;
