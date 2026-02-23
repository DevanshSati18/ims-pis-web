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
  const isFormValid = email.trim() !== "" && password.trim() !== "";
  
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
      style={{ backgroundImage: "url('/main_school.png')" }}
    >
      {/* Overlay - Slightly softened the blur for a cleaner look */}
      <div className="absolute inset-0 bg-white/75 backdrop-blur-sm" />

      {/* Wrapping content in a flex-col ensures the main card centers perfectly between the header and bottom */}
      <div className="relative z-10 flex min-h-screen flex-col">
        
        {/* ================= HEADER ================= */}
        <header className="border-b border-[var(--border-main)] bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 md:flex-row md:justify-between md:gap-6">
            <div className="shrink-0 transition-transform hover:scale-105">
              <Image
                src="/school-logo.png"
                alt="School Logo"
                width={120}
                height={120}
                className="h-16 w-16 object-contain md:h-20 md:w-20"
                priority
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="font-heading text-xl font-bold tracking-tight text-[var(--primary)] md:text-2xl">
                PRANAVANANDA INTERNATIONAL SCHOOL
              </h1>
              <p className="mt-1 text-xs font-medium text-[var(--text-muted)] md:text-sm">
                (An Educational Unit of Bharat Sevashram Sangha)
              </p>
              <p className="mt-1 font-heading text-sm font-semibold italic text-[var(--secondary)] md:text-base">
                School with a difference
              </p>
            </div>
          </div>
        </header>

        {/* ================= LOGIN CARD ================= */}
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
            <div className="rounded-2xl border border-[var(--border-main)] bg-white p-8 shadow-xl shadow-[var(--primary-soft)]/50">
              
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--primary)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-bold text-[var(--text-main)]">
                  Inventory Login
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Enter your credentials to access the system
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[var(--danger)]">
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-main)]">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="teacher@school.edu"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none transition-all placeholder:text-[var(--text-light)] hover:border-[var(--primary-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-main)]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none transition-all placeholder:text-[var(--text-light)] hover:border-[var(--primary-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                    />
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={handleLogin}
                  disabled={!isFormValid}
                  className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200 
                      ${
                        isFormValid
                          ? "bg-[var(--primary)] shadow-md hover:bg-[var(--secondary)] hover:shadow-lg active:scale-[0.98]"
                          : "cursor-not-allowed bg-[var(--primary-light)] opacity-70"
                      }`}
                >
                  Sign In
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
              Secure Inventory Management System &copy; {new Date().getFullYear()}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}