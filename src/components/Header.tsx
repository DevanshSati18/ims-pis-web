"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { clearUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import Image from "next/image";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname(); // 👈 Added to track active route
  
  const user = useSelector((state: RootState) => state.auth.user);
  
  // States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Password Change States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Helper to extract First Name
  const firstName = user?.name ? user.name.split(" ")[0] : "Profile";
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setIsChangingPwd(true);
    setPwdMessage({ type: "", text: "" });
    try {
      // Calls the new backend route we will create below
      await api.put(`/users/change-password`, { newPassword });
      setPwdMessage({ type: "success", text: "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPwdMessage({ type: "error", text:  "Failed to update password." });
    } finally {
      setIsChangingPwd(false);
    }
  };

  // Active Link Styling Helpers
  const isDashboardActive = pathname?.startsWith("/dashboard");
  const isAdminActive = pathname?.startsWith("/admin");

  const getLinkClasses = (isActive: boolean) => 
    `rounded-lg px-3 py-2 text-sm font-medium transition-all ${
      isActive 
        ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-bold shadow-sm' 
        : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--primary)]'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-main)] bg-[var(--bg-card)]/90 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 sm:px-8">
          
          {/* LEFT SECTION */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="group flex items-center gap-2 transition-transform hover:-translate-y-[1px]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] transition-colors group-hover:text-white">
                <Image src="/school-logo.png" alt="school_logo" width={100} height={100} />
              </div>
              <div className="font-heading text-2xl font-bold tracking-tight text-[var(--text-main)] transition-colors group-hover:text-[var(--primary)]">
                IMS
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden items-center gap-2 md:flex">
              <Link href="/dashboard" className={getLinkClasses(!!isDashboardActive)}>
                Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" className={getLinkClasses(!!isAdminActive)}>
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* PROFILE BUTTON */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[var(--border-main)] bg-[var(--bg-subtle)] py-1 pl-1 pr-3 transition-all hover:border-[var(--primary-light)] hover:bg-white hover:shadow-sm active:scale-95"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white shadow-sm">
                {initials}
              </div>
              <span className="hidden text-sm font-semibold capitalize text-[var(--text-main)] sm:inline-block">
                {firstName}
              </span>
            </button>

            {/* LOGOUT BUTTON (Hidden on mobile to save space, moved to menu) */}
            <button
              onClick={handleLogout}
              className="group hidden items-center gap-2 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--text-muted)] shadow-sm transition-all hover:border-[var(--danger)] hover:bg-red-50 hover:text-[var(--danger)] active:scale-95 sm:flex"
            >
              Logout
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={toggleMobileMenu}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-main)] bg-[var(--bg-subtle)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)] md:hidden"
            >
              {isMobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>

          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="animate-in slide-in-from-top-2 border-t border-[var(--border-main)] bg-[var(--bg-card)] md:hidden">
            <nav className="flex flex-col space-y-2 p-4">
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClasses(!!isDashboardActive)}>
                Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClasses(!!isAdminActive)}>
                  Admin Panel
                </Link>
              )}
              <div className="my-2 border-t border-[var(--border-main)]"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ================= PROFILE MODAL ================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md scale-100 overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-main)] bg-[var(--bg-subtle)] px-6 py-4">
              <h3 className="font-heading text-lg font-bold text-[var(--text-main)]">My Profile</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="rounded-md p-1 text-[var(--text-light)] transition-colors hover:bg-[var(--border-main)] hover:text-red-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              {/* User Info Details */}
              <div className="mb-6 flex items-center gap-4 border-b border-[var(--border-main)] pb-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-2xl font-bold text-white shadow-inner">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-main)]">{user?.name || "User"}</h2>
                  <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user?.role}
                    </span>
                    {user?.mobile && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-light)]">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {user.mobile}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Change Password</h4>
                
                {pwdMessage.text && (
                  <div className={`rounded-lg p-3 text-sm font-medium ${pwdMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                    {pwdMessage.text}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-main)]">New Password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-[var(--border-main)] bg-[var(--bg-subtle)] px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-soft)]"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-main)]">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-[var(--border-main)] bg-[var(--bg-subtle)] px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-soft)]"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isChangingPwd || !newPassword || !confirmPassword}
                  className="mt-2 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50"
                >
                  {isChangingPwd ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}