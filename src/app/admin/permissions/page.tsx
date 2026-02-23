"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import Link from "next/link";
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

  // Helper to get current user info for UI display
  const currentUserInfo = users.find((u) => u.id === selectedUser);

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

  const hasPermission = (token: string) => permissions.includes(token);

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
      <div className="flex min-h-screen flex-col bg-[var(--bg-subtle)] text-[var(--text-main)]">
        <Header />

        <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          
          {/* BREADCRUMB & HEADER */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Link
              href="/admin/users"
              className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
            >
              <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
              Back to User Management
            </Link>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">
              Access & Permissions
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
              Control exactly which inventory sections this user can view or modify.
            </p>
          </div>

          {/* USER SELECTOR (If not deep-linked from Users page) */}
          {!searchParams.get("user") && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
              <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-6">
                <label className="mb-2 block text-sm font-semibold text-[var(--text-main)]">
                  Select User Account
                </label>
                <select
                  className="w-full appearance-none rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-3 text-sm font-medium outline-none transition-all hover:border-[var(--primary-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">-- Choose a user to manage --</option>
                  {users
                    .filter((u) => u.role !== "admin") // Exclude admins as they usually bypass permissions
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.email}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* PERMISSION MATRIX */}
          {selectedUser && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              
              {/* CURRENT USER CONTEXT BAR */}
              {currentUserInfo && (
                <div className="mb-6 flex items-center gap-4 rounded-xl border border-[var(--primary-light)] bg-[var(--primary-soft)] p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-bold text-white shadow-sm">
                    {currentUserInfo.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-main)] sm:text-base">
                      Editing Permissions For
                    </h2>
                    <p className="text-xs font-medium text-[var(--text-muted)] sm:text-sm">
                      {currentUserInfo.email}
                    </p>
                  </div>
                </div>
              )}

              {/* DEPARTMENT GRIDS */}
              <div className="grid gap-6">
                {departments.map((dept) => {
                  const sds = subDepartments[dept.key] || [];

                  return (
                    <div key={dept.key} className="overflow-hidden rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-sm">
                      {/* Department Header */}
                      <div className="flex items-center gap-3 border-b border-[var(--border-main)] bg-[var(--bg-subtle)] px-5 py-4 sm:px-6">
                        <div className="rounded-lg bg-white p-2 text-[var(--primary)] shadow-sm">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-[var(--text-main)]">
                          {dept.name}
                        </h3>
                      </div>

                      {/* Sub-Departments List */}
                      <div className="p-2 sm:p-4">
                        {sds.length === 0 ? (
                          <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                            No sections created in this department yet.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {sds.map((sd) => (
                              <div
                                key={sd.key}
                                className="flex flex-col justify-between gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-[var(--border-main)] hover:bg-[var(--bg-hover)] sm:flex-row sm:items-center sm:p-4"
                              >
                                <div className="font-medium text-[var(--text-main)]">
                                  {sd.name}
                                </div>
                                
                                <div className="flex items-center gap-6 sm:gap-8">
                                  {/* READ TOGGLE */}
                                  <label className="group flex cursor-pointer items-center gap-2.5">
                                    <div className="relative flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-[var(--border-main)] bg-white transition-all checked:border-[var(--primary)] checked:bg-[var(--primary)] hover:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:ring-offset-1"
                                        checked={hasPermission(`${dept.key}:${sd.key}:read`)}
                                        onChange={() => dispatch(togglePermission(`${dept.key}:${sd.key}:read`))}
                                      />
                                      <svg className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)]">Read Only</span>
                                  </label>

                                  {/* WRITE TOGGLE */}
                                  <label className="group flex cursor-pointer items-center gap-2.5">
                                    <div className="relative flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-[var(--border-main)] bg-white transition-all checked:border-[var(--secondary)] checked:bg-[var(--secondary)] hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] focus:ring-offset-1"
                                        checked={hasPermission(`${dept.key}:${sd.key}:write`)}
                                        onChange={() => dispatch(togglePermission(`${dept.key}:${sd.key}:write`))}
                                      />
                                      <svg className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)]">Write / Edit</span>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ACTION BAR */}
              <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={() => router.push("/admin/users")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-main)] bg-white px-6 py-3 text-sm font-semibold text-[var(--text-muted)] shadow-sm transition-all hover:bg-gray-50 hover:text-[var(--text-main)] active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[var(--secondary)] hover:shadow-lg active:scale-95"
                >
                  Save Permissions
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminRoute>
  );
}