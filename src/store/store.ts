import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import departmentReducer from "./departmentSlice";
import subDepartmentReducer from "./subDepartmentSlice";
import inventoryReducer from "./inventorySlice";
import recordReducer from "./recordSlice";
import adminDepartmentReducer from "./adminDepartmentSlice";
import adminSubDepartmentReducer from "./adminSubDepartmentSlice";
import adminUserReducer from "./adminUserSlice";
import adminPermissionsReducer from "./adminPermissionSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    subDepartments: subDepartmentReducer,
    inventory: inventoryReducer,
    records: recordReducer,
    adminDepartments: adminDepartmentReducer,
    adminSubDepartments: adminSubDepartmentReducer,
    adminUsers : adminUserReducer,
    adminPermissions : adminPermissionsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
