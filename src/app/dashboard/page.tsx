"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/api";
import { clearUser } from "@/store/authSlice";

export default function DashboardPage() {
  useAuthInit();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const logout = async () => {
    await api.post("/auth/logout");
    dispatch(clearUser());
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black text-white p-6">
          <h2 className="text-lg font-semibold mb-6">IMS Dashboard</h2>

          <ul className="space-y-3 text-sm">
            <li className="opacity-80">Home</li>
            <li className="opacity-80">Departments</li>
            <li className="opacity-80">Reports</li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Welcome, {user?.role}
            </h1>

            <button
              onClick={logout}
              className="border px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Phase 2A structure is ready. Departments and sub-departments
              will appear here next.
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
