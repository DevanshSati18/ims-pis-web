import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export interface CreateRecordPayload {
  departmentKey: string;
  subDepartmentKey: string;
  title: string;
  data: Record<string, string | number | boolean>;
}

export interface UploadFilePayload {
  recordId: string;
  fieldKey: string;
  file: File;
}

export const createRecord = createAsyncThunk(
  "records/create",
  async (payload: CreateRecordPayload) => {
    const res = await api.post("/records", payload);
    return res.data;
  }
);

export const uploadRecordFile = createAsyncThunk(
  "records/uploadFile",
  async (payload: UploadFilePayload) => {
    const form = new FormData();
    form.append("fieldKey", payload.fieldKey);
    form.append("files", payload.file);

    const res = await api.post(
      `/records/${payload.recordId}/documents`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  }
);

interface RecordState {
  creating: boolean;
}

const initialState: RecordState = {
  creating: false,
};

const recordSlice = createSlice({
  name: "records",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRecord.pending, (state) => {
        state.creating = true;
      })
      .addCase(createRecord.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createRecord.rejected, (state) => {
        state.creating = false;
      });
  },
});

export default recordSlice.reducer;
