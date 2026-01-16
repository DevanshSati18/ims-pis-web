"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUsersAdmin,
  createUserAdmin,
  resetPasswordAdmin,
  toggleUserStatusAdmin,
} from "@/store/adminUserSlice";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.adminUsers);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    dispatch(fetchUsersAdmin());
  }, [dispatch]);

  const handleCreate = () => {
    if (!email || !password) return;
    dispatch(createUserAdmin({ email, password, role }));
    setEmail("");
    setPassword("");
  };

  const handleReset = (userId: string) => {
    const pwd = prompt("Enter new password");
    if (!pwd) return;
    dispatch(resetPasswordAdmin({ userId, password: pwd }));
  };

  const handleToggle = (userId: string, isActive = true) => {
    dispatch(toggleUserStatusAdmin({ userId, isActive }));
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-6xl p-6">
          <h1 className="mb-6 text-2xl font-semibold">
            Users
          </h1>

          {/* Create User */}
          <div className="mb-6 rounded border bg-white p-4">
            <h2 className="mb-3 font-medium">
              Create User
            </h2>

            <div className="flex gap-3">
              <input
                className="flex-1 border p-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="flex-1 border p-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                className="border p-2"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "admin" | "user")
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleCreate}
                className="rounded bg-blue-600 px-4 text-white"
              >
                Create
              </button>
            </div>
          </div>

          {/* User List */}
          <div className="rounded border bg-white">
            {items.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between border-b p-4 last:border-b-0"
              >
                <div>
                  <div className="font-medium">{u.email}</div>
                  <div className="text-sm text-gray-500">
                    Role: {u.role}
                  </div>
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => handleReset(u.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Reset Password
                  </button>

                  <button
                    onClick={() =>
                      handleToggle(u.id, !(u.isActive ?? true))
                    }
                    className="text-red-600 hover:underline"
                  >
                    {(u.isActive ?? true)
                      ? "Disable"
                      : "Enable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
