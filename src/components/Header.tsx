"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { clearUser } from "@/store/authSlice";
import { RootState } from "@/store/store";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore errors
    } finally {
      dispatch(clearUser());
      router.push("/login");
    }
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="text-lg font-bold">IMS</div>

        <Link
          href="/dashboard"
          className="text-sm text-gray-700 hover:underline"
        >
          Dashboard
        </Link>

        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="text-sm text-blue-600 hover:underline"
          >
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Role: <strong>{user?.role}</strong>
        </span>

        <button
          onClick={handleLogout}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
