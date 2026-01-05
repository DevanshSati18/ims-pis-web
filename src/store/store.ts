import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import departmentReducer from "./departmentSlice";
import subDepartmentReducer from "./subDepartmentSlice";
import inventoryReducer from "./inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    subDepartments: subDepartmentReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
