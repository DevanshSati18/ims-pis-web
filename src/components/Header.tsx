"use client";

import { useState } from "react";
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
  
  // State to manage mobile menu open/close
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-main)] bg-[var(--bg-card)]/90 shadow-sm backdrop-blur-md">
      
      {/* MAIN TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-8">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">
          
          {/* LOGO */}
          <Link href="/dashboard" className="group flex items-center gap-2 transition-transform hover:-translate-y-[1px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="font-heading text-2xl font-bold tracking-tight text-[var(--text-main)] transition-colors group-hover:text-[var(--primary)]">
              IMS
            </div>
          </Link>

          {/* DESKTOP NAVIGATION (Hidden on mobile) */}
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--primary)]"
            >
              Dashboard
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--primary)]"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* USER ROLE BADGE (Hidden on very small screens to save space for menu) */}
          <div className="hidden items-center gap-2 rounded-full border border-[var(--border-main)] bg-[var(--bg-subtle)] py-1 pl-1 pr-3 sm:flex">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-light)] text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs font-semibold capitalize text-[var(--text-main)]">
              {user?.role || "Guest"}
            </span>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--text-muted)] shadow-sm transition-all hover:border-[var(--danger)] hover:bg-red-50 hover:text-[var(--danger)] active:scale-95"
          >
            <span className="hidden sm:inline">Logout</span>
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>

          {/* MOBILE MENU TOGGLE BUTTON (Visible only on mobile) */}
          <button
            onClick={toggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-main)] bg-[var(--bg-subtle)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)] md:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="animate-in slide-in-from-top-2 border-t border-[var(--border-main)] bg-[var(--bg-card)] md:hidden">
          <nav className="flex flex-col p-4 space-y-2">
            
            {/* Mobile User Info */}
            <div className="mb-2 flex items-center gap-3 rounded-lg bg-[var(--bg-subtle)] p-3 sm:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[var(--text-muted)]">Logged in as</span>
                <span className="text-sm font-semibold capitalize text-[var(--text-main)]">
                  {user?.role || "Guest"}
                </span>
              </div>
            </div>

            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-main)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)]"
            >
              <svg className="h-5 w-5 text-[var(--text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-main)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)]"
              >
                <svg className="h-5 w-5 text-[var(--text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}