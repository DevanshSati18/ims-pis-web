"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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

export default function AdminPermissionsClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const users = useAppSelector((s) => s.adminUsers.items);
  const departments = useAppSelector((s) => s.departments);
  const subDepartments = useAppSelector((s) => s.subDepartments);
  const permissions = useAppSelector(
    (s) => s.adminPermissions.current
  );

  const [selectedUser, setSelectedUser] = useState(
    () => searchParams.get("user") || ""
  );

  const currentUserInfo = users.find((u) => u.id === selectedUser);

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    dispatch(fetchUsersAdmin());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    departments.forEach((d) => {
      dispatch(fetchSubDepartments(d.key));
    });
  }, [departments, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchUserPermissions(selectedUser));
    }
  }, [selectedUser, dispatch]);

  /* ---------------- HELPERS ---------------- */

  const hasPermission = (token: string) => permissions.includes(token);

  const handleSave = async () => {
    if (!selectedUser) return;

    await dispatch(
      saveUserPermissions({
        userId: selectedUser,
        visibleSubDepartments: permissions,
      })
    );

    router.push("/admin/users");
  };

  /* ---------------- RENDER ---------------- */

  return (
    <AdminRoute>
      <div className="flex min-h-screen flex-col bg-[var(--bg-subtle)]">
        <Header />

        <main className="mx-auto w-full max-w-5xl p-6">
          <Link
            href="/admin/users"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            ← Back to User Management
          </Link>

          <h1 className="text-2xl font-bold mb-6">
            Access & Permissions
          </h1>

          {!searchParams.get("user") && (
            <select
              className="w-full rounded border p-3 mb-6"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select user</option>
              {users
                .filter((u) => u.role !== "admin")
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email}
                  </option>
                ))}
            </select>
          )}

          {selectedUser && (
            <>
              {currentUserInfo && (
                <p className="mb-4 font-medium">
                  Editing: {currentUserInfo.email}
                </p>
              )}

              {departments.map((dept) => {
                const sds = subDepartments[dept.key] || [];

                return (
                  <div key={dept.key} className="mb-6 border rounded p-4">
                    <h2 className="font-semibold mb-3">{dept.name}</h2>

                    {sds.map((sd) => (
                      <div
                        key={sd.key}
                        className="flex justify-between py-2"
                      >
                        <span>{sd.name}</span>

                        <div className="flex gap-4">
                          <input
                            type="checkbox"
                            checked={hasPermission(
                              `${dept.key}:${sd.key}:read`
                            )}
                            onChange={() =>
                              dispatch(
                                togglePermission(
                                  `${dept.key}:${sd.key}:read`
                                )
                              )
                            }
                          />

                          <input
                            type="checkbox"
                            checked={hasPermission(
                              `${dept.key}:${sd.key}:write`
                            )}
                            onChange={() =>
                              dispatch(
                                togglePermission(
                                  `${dept.key}:${sd.key}:write`
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              <button
                onClick={handleSave}
                className="mt-6 rounded bg-blue-600 px-6 py-3 text-white"
              >
                Save Permissions
              </button>
            </>
          )}
        </main>
      </div>
    </AdminRoute>
  );
}