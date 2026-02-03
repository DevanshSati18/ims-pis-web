"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const users = useAppSelector((s) => s.adminUsers.items);
  const departments = useAppSelector((s) => s.departments);
  const subDepartments = useAppSelector((s) => s.subDepartments);
  const permissions = useAppSelector(
    (s) => s.adminPermissions.current
  );

  /* ✅ Derived initial state (no effect) */
  const [selectedUser, setSelectedUser] = useState<string>(
    () => searchParams.get("user") || ""
  );

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    dispatch(fetchUsersAdmin());
    dispatch(fetchDepartments());
  }, [dispatch]);

  /* Load sub-departments */
  useEffect(() => {
    departments.forEach((d) => {
      dispatch(fetchSubDepartments(d.key));
    });
  }, [departments, dispatch]);

  /* Load permissions when user changes */
  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchUserPermissions(selectedUser));
    }
  }, [selectedUser, dispatch]);

  /* ---------------- HELPERS ---------------- */

  const hasPermission = (token: string) =>
    permissions.includes(token);

  const handleSave = async () => {
    if (!selectedUser) return;

    await dispatch(
      saveUserPermissions({
        userId: selectedUser,
        visibleSubDepartments: permissions,
      })
    );

    // ✅ Redirect back to Admin → Users
    router.push("/admin/users");
  };

  /* ---------------- RENDER ---------------- */

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-6xl p-6">
          <h1 className="mb-6 text-2xl font-semibold">
            Update User Permissions
          </h1>

          {/* USER SELECT (only if NOT deep-linked) */}
          {!searchParams.get("user") && (
            <select
              className="mb-6 w-full border p-2"
              value={selectedUser}
              onChange={(e) =>
                setSelectedUser(e.target.value)
              }
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
          )}

          {/* PERMISSION MATRIX */}
          {selectedUser && (
            <div className="rounded-lg border bg-white p-6">
              {departments.map((dept) => (
                <div key={dept.key} className="mb-6">
                  <div className="mb-2 font-medium">
                    {dept.name}
                  </div>

                  {(subDepartments[dept.key] || []).map(
                    (sd) => (
                      <div
                        key={sd.key}
                        className="ml-4 flex items-center gap-6 text-sm"
                      >
                        {["read", "write"].map((mode) => {
                          const token = `${dept.key}:${sd.key}:${mode}`;

                          return (
                            <label
                              key={mode}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={hasPermission(
                                  token
                                )}
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

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleSave}
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Save & Return
                </button>

                <button
                  onClick={() =>
                    router.push("/admin/users")
                  }
                  className="rounded border px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminRoute>
  );
}
