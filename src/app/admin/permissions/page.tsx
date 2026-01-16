"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsersAdmin } from "@/store/adminUserSlice";
import { fetchDepartments } from "@/store/departmentSlice";
import { fetchSubDepartments } from "@/store/subDepartmentSlice";
import {
  fetchUserPermissions,
  saveUserPermissions,
  togglePermission,
} from "@/store/adminPermissionSlice";

export default function AdminPermissionsPage() {
  const dispatch = useAppDispatch();

  const users = useAppSelector((s) => s.adminUsers.items);
  const departments = useAppSelector((s) => s.departments);
  const subDepartments = useAppSelector((s) => s.subDepartments);
  const permissions = useAppSelector(
    (s) => s.adminPermissions.current
  );

  const [selectedUser, setSelectedUser] =
    useState<string>("");

  useEffect(() => {
    dispatch(fetchUsersAdmin());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    departments.forEach((d) =>
      dispatch(fetchSubDepartments(d.key))
    );
  }, [departments, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchUserPermissions(selectedUser));
    }
  }, [selectedUser, dispatch]);

  const handleSave = () => {
    dispatch(
      saveUserPermissions({
        userId: selectedUser,
        visibleSubDepartments: permissions,
      })
    );
    alert("Permissions saved");
  };

  const isChecked = (token: string) =>
    permissions.includes(token);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-6xl p-6">
          <h1 className="mb-6 text-2xl font-semibold">
            Permission Assignment
          </h1>

          {/* User selector */}
          <select
            className="mb-6 w-full border p-2"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users
              .filter((u) => u.role !== "admin")
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
          </select>

          {/* Permission matrix */}
          {selectedUser && (
            <div className="rounded border bg-white p-4">
              {departments.map((d) => (
                <div key={d.key} className="mb-4">
                  <div className="font-medium">{d.name}</div>

                  {(subDepartments[d.key] || []).map(
                    (sd) => (
                      <div
                        key={sd.key}
                        className="ml-4 flex gap-6 text-sm"
                      >
                        {["read", "write"].map((mode) => {
                          const token = `${d.key}:${sd.key}:${mode}`;
                          return (
                            <label
                              key={mode}
                              className="flex items-center gap-1"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked(token)}
                                onChange={() =>
                                  dispatch(
                                    togglePermission(token)
                                  )
                                }
                              />
                              {sd.name} ({mode})
                            </label>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              ))}

              <button
                onClick={handleSave}
                className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
              >
                Save Permissions
              </button>
            </div>
          )}
        </main>
      </div>
    </AdminRoute>
  );
}
