"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { setUser } from "@/store/authSlice";
import { RootState } from "@/store/store";

export default function LoginPage() {
  const { user, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [loading, user, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email, password });
    dispatch(setUser(res.data));
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-80 space-y-3 rounded border p-6">
        <h1 className="text-xl font-bold">Login</h1>
        <input
          className="w-full border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 p-2 text-white"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
