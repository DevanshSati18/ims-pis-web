import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export interface InventoryItem {
  _id: string;
  name: string;
  departmentKey: string;
  subDepartmentKey: string;
  quantity: number;
}

export const fetchInventoryBySubDept = createAsyncThunk(
  "inventory/fetchBySubDept",
  async (subDepartmentKey: string) => {
    const res = await api.get("/inventory", {
      params: { subDepartmentKey },
    });
    return { subDepartmentKey, items: res.data as InventoryItem[] };
  }
);

type InventoryState = {
  bySubDept: Record<string, InventoryItem[]>;
  loading: boolean;
};

const initialState: InventoryState = {
  bySubDept: {},
  loading: false,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryBySubDept.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryBySubDept.fulfilled, (state, action) => {
        state.bySubDept[action.payload.subDepartmentKey] =
          action.payload.items;
        state.loading = false;
      })
      .addCase(fetchInventoryBySubDept.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default inventorySlice.reducer;
