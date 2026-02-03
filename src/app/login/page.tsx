"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/authSlice";
import { api } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      dispatch(setUser(res.data));
      router.push("/dashboard");
    } catch {
      setError("Invalid login credentials");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ================= HEADER ================= */}
      <header className="relative z-10 bg-[#f6a000]">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
          {/* Bigger Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/school-logo.png"
              alt="School Logo"
              width={110}
              height={110}
              className="h-20 w-20 object-contain md:h-24 md:w-24"
              priority
            />
          </div>

          {/* Text */}
          <div className="flex-1 text-center">
            <h1 className="font-heading text-xl font-bold text-red-700 md:text-3xl">
              PRANAVANANDA INTERNATIONAL SCHOOL
            </h1>
            <p className="mt-1 text-xs text-blue-900 md:text-base">
              (An Educational Unit of Bharat Sevashram Sangha)
            </p>
            <p className="mt-1 font-script text-base text-red-800 md:text-lg">
              School with a difference
            </p>
          </div>
        </div>
      </header>

      {/* ================= LOGIN CARD ================= */}
      <main className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-black/70 p-8 text-white shadow-2xl backdrop-blur-md">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-wide">
            Inventory Management Login
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 p-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email */}
            <div className="group relative">
              <input
                type="email"
                placeholder="User ID / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-400 bg-transparent px-2 py-3 text-white placeholder-gray-300 transition focus:border-blue-400 focus:outline-none"
              />
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-focus-within:w-full" />
            </div>

            {/* Password */}
            <div className="group relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-400 bg-transparent px-2 py-3 text-white placeholder-gray-300 transition focus:border-blue-400 focus:outline-none"
              />
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-focus-within:w-full" />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              className="mt-6 w-full rounded-lg bg-blue-600 py-2 text-lg font-medium text-white transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
            >
              Submit →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
