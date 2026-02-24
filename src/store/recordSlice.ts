import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { RecordItem } from "@/types/record";

/* ---------------- THUNKS ---------------- */

export const fetchRecords = createAsyncThunk(
  "records/fetch",
  async (
    params: { departmentKey: string; subDepartmentKey: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get<RecordItem[]>("/records", { params });
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch records");
    }
  }
);

export const createRecord = createAsyncThunk(
  "records/create",
  async (
    payload: {
      departmentKey: string;
      subDepartmentKey: string;
      title: string;
      data: Record<string, string | number | boolean>;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<RecordItem>("/records", payload);
      return res.data;
    } catch {
      return rejectWithValue("Failed to create record");
    }
  }
);

export const uploadRecordFile = createAsyncThunk(
  "records/uploadFile",
  async (
    payload: { recordId: string; fieldKey: string; file: File },
    { rejectWithValue }
  ) => {
    try {
      const form = new FormData();
      form.append("fieldKey", payload.fieldKey);
      // Matches your backend multer config expecting "files"
      form.append("files", payload.file); 

      const res = await api.post<RecordItem>(
        `/records/${payload.recordId}/documents`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return res.data;
    } catch  {
      return rejectWithValue( "Failed to upload document");
    }
  }
);

// NEW: Delete Record functionality
export const deleteRecord = createAsyncThunk(
  "records/delete",
  async (recordId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/records/${recordId}`);
      return recordId; // Return the ID so the reducer can remove it from the UI
    } catch  {
      return rejectWithValue( "Failed to delete record");
    }
  }
  
);
// Add this under deleteRecord
export const updateRecord = createAsyncThunk(
  "records/update",
  async (
    payload: { recordId: string; title: string; data: Record <string , unknown> },
    { rejectWithValue }
  ) => {
    try {
      // Adjust this URL if your backend uses PUT instead of PATCH, or a different route
      const res = await api.patch<RecordItem>(`/records/${payload.recordId}`, {
        title: payload.title,
        data: payload.data,
      });
      return res.data;
    } catch  {
      return rejectWithValue("Failed to update record");
    }
  }
);

/* ---------------- SLICE STATE ---------------- */

interface RecordState {
  items: RecordItem[];
  loading: boolean;
  error: string | null; // Added error tracking
}

const initialState: RecordState = {
  items: [],
  loading: false,
  error: null,
};

/* ---------------- SLICE REDUCER ---------------- */

const recordSlice = createSlice({
  name: "records",
  initialState,
  reducers: {
    clearRecordError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- FETCH --- */
      .addCase(fetchRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- CREATE --- */
      .addCase(createRecord.fulfilled, (state, action) => {
        // Push the new record immediately into the UI list
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(createRecord.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      /* --- UPLOAD FILE --- */
      .addCase(uploadRecordFile.fulfilled, (state, action) => {
        // Since your backend returns the updated record item after upload,
        // we replace the old record with the new one containing the file data.
        if (action.payload && (action.payload._id)) {
          const index = state.items.findIndex(r => r._id === action.payload._id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(uploadRecordFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      /* --- DELETE --- */
      .addCase(deleteRecord.fulfilled, (state, action) => {
        // Filter out the deleted record from the UI immediately
        state.items = state.items.filter((record) => record._id !== action.payload);
      })
      .addCase(deleteRecord.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      /* --- UPDATE --- */
      .addCase(updateRecord.fulfilled, (state, action) => {
        // Find the edited record and replace it with the fresh data from the backend
        const index = state.items.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateRecord.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearRecordError } = recordSlice.actions;
export default recordSlice.reducer;