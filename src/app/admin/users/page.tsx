"use client";

import { useEffect, useMemo, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUsersAdmin,
  createUserAdmin,
  resetPasswordAdmin,
  toggleUserStatusAdmin,
} from "@/store/adminUserSlice";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const users = useAppSelector((s) => s.adminUsers.items);

  /* ---------------- CREATE USER ---------------- */

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] =
    useState<"admin" | "user">("user");

  /* ---------------- MANAGE USER ---------------- */

  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId),
    [users, selectedUserId]
  );

  useEffect(() => {
    dispatch(fetchUsersAdmin());
  }, [dispatch]);

  /* ---------------- HANDLERS ---------------- */

  const handleCreateUser = () => {
    if (!newEmail || !newPassword) return;

    dispatch(
      createUserAdmin({
        email: newEmail,
        password: newPassword,
        role: newRole,
      })
    );

    setNewEmail("");
    setNewPassword("");
    setNewRole("user");
  };

  const handleSearch = () => {
    const user = users.find(
      (u) => u.email.toLowerCase() === searchEmail.toLowerCase()
    );
    setSelectedUserId(user ? user.id : null);
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;

    const pwd = prompt(
      `Enter new password for ${selectedUser.email}`
    );
    if (!pwd) return;

    dispatch(
      resetPasswordAdmin({
        userId: selectedUser.id,
        password: pwd,
      })
    );

    alert("Password reset successfully");
  };

  const handleToggleStatus = () => {
    if (!selectedUser) return;

    dispatch(
      toggleUserStatusAdmin({
        userId: selectedUser.id,
        isActive: !(selectedUser.isActive ?? true),
      })
    );
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-5xl p-6">
          <h1 className="mb-8 text-2xl font-semibold">
            User Management
          </h1>

          {/* ---------------- CREATE USER ---------------- */}
          <section className="mb-10 rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">
              Create New User
            </h2>

            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="border p-2"
                placeholder="Email"
                value={newEmail}
                onChange={(e) =>
                  setNewEmail(e.target.value)
                }
              />
              <input
                className="border p-2"
                placeholder="Initial Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />
              <select
                className="border p-2"
                value={newRole}
                onChange={(e) =>
                  setNewRole(
                    e.target.value as "admin" | "user"
                  )
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={handleCreateUser}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
            >
              Create User
            </button>
          </section>

          {/* ---------------- MANAGE USER ---------------- */}
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">
              Manage Existing User
            </h2>

            <div className="flex gap-3">
              <input
                className="flex-1 border p-2"
                placeholder="Enter user email"
                value={searchEmail}
                onChange={(e) =>
                  setSearchEmail(e.target.value)
                }
              />
              <button
                onClick={handleSearch}
                className="rounded bg-gray-800 px-4 py-2 text-white"
              >
                Search
              </button>
            </div>

            {!selectedUser && searchEmail && (
              <div className="mt-4 text-sm text-red-600">
                User not found
              </div>
            )}

            {selectedUser && (
              <div className="mt-6 rounded border p-4">
                <div className="mb-2 font-medium">
                  {selectedUser.email}
                </div>

                <div className="mb-4 text-sm text-gray-600">
                  Role: {selectedUser.role} <br />
                  Status:{" "}
                  {selectedUser.isActive === false
                    ? "Disabled"
                    : "Active"}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <button
                    onClick={handleResetPassword}
                    className="text-blue-600 hover:underline"
                  >
                    Reset Password
                  </button>

                  <button
                    onClick={handleToggleStatus}
                    className="text-red-600 hover:underline"
                  >
                    {selectedUser.isActive === false
                      ? "Enable User"
                      : "Disable User"}
                  </button>

                  {selectedUser.role !== "admin" && (
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/permissions?user=${selectedUser.id}`
                        )
                      }
                      className="text-green-600 hover:underline"
                    >
                      Manage Permissions
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </AdminRoute>
  );
}
