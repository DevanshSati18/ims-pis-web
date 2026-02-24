import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { SubDepartment } from "@/types/schema";

// 1. Fetch
export const fetchSubDepartmentsAdmin = createAsyncThunk(
  "adminSubDepartments/fetch",
  async (departmentKey: string, { rejectWithValue }) => {
    try {
      const res = await api.get<SubDepartment[]>(
        `/sub-departments/${departmentKey}`
      );
      return res.data;
    } catch  {
      // Safely pass the backend error message to our Redux state
      return rejectWithValue("Failed to fetch sub-departments");
    }
  }
);

// 2. Create
export const createSubDepartmentAdmin = createAsyncThunk(
  "adminSubDepartments/create",
  async (
    payload: {
      departmentKey: string;
      key: string;
      name: string;
      fields: SubDepartment["fields"];
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<SubDepartment>("/sub-departments", payload);
      
      // Some backends return the object nested inside a 'data' or 'subDepartment' key.
      // If your backend returns { success: true, data: {...} }, change this to: return res.data.data;
      return res.data; 
    } catch {
      // console.error("API POST Error:", error.response?.data || error.message);
      return rejectWithValue("Failed to create sub-department");
    }
  }
);

// 3. Delete
export const deleteSubDepartmentAdmin = createAsyncThunk(
  "adminSubDepartments/delete",
  async (
    payload: { departmentKey: string; key: string },
    { rejectWithValue }
  ) => {
    try {
      await api.delete(
        `/sub-departments/${payload.departmentKey}/${payload.key}`
      );
      return payload;
    } catch {
      return rejectWithValue( "Failed to delete sub-department");
    }
  }
);

interface AdminSubDepartmentState {
  items: SubDepartment[];
  loading: boolean;
  error: string | null; // NEW: Track errors so we can debug easily
}

const initialState: AdminSubDepartmentState = {
  items: [],
  loading: false,
  error: null,
};

const adminSubDepartmentSlice = createSlice({
  name: "adminSubDepartments",
  initialState,
  reducers: {
    // Optional: A way to manually clear errors if needed
    clearSubDepartmentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- FETCH --- */
      .addCase(fetchSubDepartmentsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubDepartmentsAdmin.fulfilled, (state, action) => {
        // Ensure we always have an array, even if the backend returns null
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchSubDepartmentsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- CREATE --- */
      .addCase(createSubDepartmentAdmin.pending, (state) => {
        state.error = null;
      })
      .addCase(createSubDepartmentAdmin.fulfilled, (state, action) => {
        // Safety check: Only push if the payload is a valid object
        if (action.payload && action.payload.key) {
          state.items.push(action.payload);
        }
      })
      .addCase(createSubDepartmentAdmin.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      /* --- DELETE --- */
      .addCase(deleteSubDepartmentAdmin.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteSubDepartmentAdmin.fulfilled, (state, action) => {
        state.items = state.items.filter((sd) => sd.key !== action.payload.key);
      })
      .addCase(deleteSubDepartmentAdmin.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSubDepartmentError } = adminSubDepartmentSlice.actions;
export default adminSubDepartmentSlice.reducer;