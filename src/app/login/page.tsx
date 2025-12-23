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
      <div className="p-6 border rounded w-96 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white w-full py-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
