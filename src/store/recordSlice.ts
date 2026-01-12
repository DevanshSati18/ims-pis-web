import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { RecordItem } from "@/types/record";

export const fetchRecords = createAsyncThunk(
  "records/fetch",
  async (params: {
    departmentKey: string;
    subDepartmentKey: string;
  }) => {
    const res = await api.get<RecordItem[]>("/records", {
      params,
    });
    return res.data;
  }
);

export const createRecord = createAsyncThunk(
  "records/create",
  async (payload: {
    departmentKey: string;
    subDepartmentKey: string;
    title: string;
    data: Record<string, string | number | boolean>;
  }) => {
    const res = await api.post<RecordItem>("/records", payload);
    return res.data;
  }
);

export const uploadRecordFile = createAsyncThunk(
  "records/uploadFile",
  async (payload: {
    recordId: string;
    fieldKey: string;
    file: File;
  }) => {
    const form = new FormData();
    form.append("fieldKey", payload.fieldKey);
    form.append("files", payload.file);

    const res = await api.post<RecordItem>(
      `/records/${payload.recordId}/documents`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data;
  }
);

interface RecordState {
  items: RecordItem[];
  loading: boolean;
}

const initialState: RecordState = {
  items: [],
  loading: false,
};

const recordSlice = createSlice({
  name: "records",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecords.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default recordSlice.reducer;
