"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email, password });
    dispatch(setUser(res.data));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Inventory Management System
        </h1>

        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
