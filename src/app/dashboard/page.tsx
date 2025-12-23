"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/api";
import { useDispatch } from "react-redux";
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
      <div className="p-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p>Role: {user?.role}</p>

        <button
          className="mt-4 border px-4 py-2"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
}
