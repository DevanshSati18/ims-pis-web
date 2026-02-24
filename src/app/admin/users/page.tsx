"use client";

import { useEffect, useMemo, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUsersAdmin,
  createUserAdmin,
  resetPasswordAdmin,
  toggleUserStatusAdmin,
} from "@/store/adminUserSlice";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const users = useAppSelector((s) => s.adminUsers.items);
  // 👈 NEW: Get the currently logged-in admin
  const currentUser = useAppSelector((s: unknown) => s.auth?.user); 

  /* ---------------- CREATE USER ---------------- */

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMobile, setNewMobile] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- MANAGE USER ---------------- */

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const selectedUser = useMemo(
    () => users.find((u: unknown) => (u.id || u._id) === selectedUserId),
    [users, selectedUserId]
  );

  useEffect(() => {
    dispatch(fetchUsersAdmin());
  }, [dispatch]);

  /* ---------------- HANDLERS ---------------- */

  const handleCreateUser = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim() || !newMobile.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createUserAdmin({
          name: newName.trim(), 
          email: newEmail.trim(),
          mobile: newMobile.trim(), 
          password: newPassword,
          role: newRole,
        })
      ).unwrap();

      alert(`${newRole === 'admin' ? 'Admin' : 'User'} created successfully!`);
      setNewName("");
      setNewEmail("");
      setNewMobile("");
      setNewPassword("");
      setNewRole("user");
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.trim().toLowerCase();

    const user = users.find(
      (u: unknown) => 
        u.email?.toLowerCase() === query &&
        u.email !== currentUser?.email // 👈 NEW: Prevent the active admin from searching themselves!
    );
    
    const foundId = user ? (user.id || user._id) : null;
    
    setSelectedUserId(foundId);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedUserId(null);
    setHasSearched(false);
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;

    const pwd = prompt(`Enter new password for ${selectedUser.email}`);
    if (!pwd) return;

    const safeId = selectedUser.id || (selectedUser as unknown)._id;

    dispatch(
      resetPasswordAdmin({
        userId: safeId,
        password: pwd,
      })
    );
    alert("Password reset successfully");
  };

  const isUserActive = selectedUser?.isActive !== false; 
  
  const handleToggleStatus = () => {
    if (!selectedUser) return;
    const isCurrentlyActive = selectedUser.isActive !== false;
    const actionText = isCurrentlyActive ? "soft delete (suspend)" : "restore";
    
    const confirm = window.confirm(
      `Are you sure you want to ${actionText} ${selectedUser.email}?\n\n${isCurrentlyActive ? 'They will no longer be able to log in, but their historical data will remain intact.' : 'They will regain access to the system.'}`
    );

    if (!confirm) return;

    const safeId = selectedUser.id || (selectedUser as unknown)._id;

    dispatch(
      toggleUserStatusAdmin({
        userId: safeId,
        isActive: !isCurrentlyActive,
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const isFormValid = newName.trim() && newEmail.trim() && newPassword.trim() && newMobile.trim();

  return (
    <AdminRoute>
      <div className="flex min-h-screen flex-col bg-[var(--bg-subtle)] text-[var(--text-main)]">
        <Header />

        <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Link
              href="/admin"
              className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
            >
              <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
              Back to Admin Console
            </Link>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">
              User Management
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
              Create and manage access for school staff and administrators.
            </p>
          </div>

          {/* ---------------- CREATE USER/ADMIN ---------------- */}
          <section className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
            <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-main)] pb-4">
                <div className="rounded-lg bg-[var(--primary-soft)] p-2 text-[var(--primary)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="font-heading text-lg font-semibold text-[var(--text-main)] sm:text-xl">
                  {newRole === "admin" ? "Create New Admin" : "Create New User"}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:items-end">
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                    Full Name <span className="text-[var(--danger)]">*</span>
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                    placeholder="e.g. John Doe"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                    Email Address <span className="text-[var(--danger)]">*</span>
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                    placeholder="teacher@school.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                    Mobile Number <span className="text-[var(--danger)]">*</span>
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                    placeholder="+91 9876543210"
                    type="tel"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                    Initial Password <span className="text-[var(--danger)]">*</span>
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                    placeholder="••••••••"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                    Role
                  </label>
                  <select
                    className="w-full appearance-none rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm outline-none transition-all hover:border-[var(--primary-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as "admin" | "user")}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 border-t border-[var(--border-main)] pt-6">
                <button
                  onClick={handleCreateUser}
                  disabled={!isFormValid || isSubmitting}
                  className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all sm:w-auto sm:px-8
                    ${(!isFormValid || isSubmitting) 
                      ? 'cursor-not-allowed bg-[var(--primary-light)] opacity-70' 
                      : 'bg-[var(--primary)] shadow-md hover:bg-[var(--secondary)] hover:shadow-lg active:scale-95'
                    }`}
                >
                  {isSubmitting ? 'Processing...' : `Create ${newRole === "admin" ? "Admin" : "User"}`}
                </button>
              </div>

            </div>
          </section>

          {/* ---------------- MANAGE USER ---------------- */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-sm">
              <div className="border-b border-[var(--border-main)] p-5 sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-[var(--bg-hover)] p-2 text-[var(--secondary)]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-[var(--text-main)] sm:text-xl">
                    Search & Manage Users
                  </h2>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                      placeholder="Enter exact email or mobile number..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (hasSearched) setHasSearched(false);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSearch}
                      className="flex-1 rounded-xl bg-gray-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-900 active:scale-95 sm:flex-none"
                    >
                      Search
                    </button>
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="flex items-center justify-center rounded-xl border border-[var(--border-main)] bg-white px-4 py-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-gray-50 hover:text-[var(--danger)] active:scale-95"
                        title="Clear Search"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {!selectedUser && hasSearched && searchQuery && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-[var(--danger)]">
                    <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    No account found matching {searchQuery}. Please check for typos.
                  </div>
                )}
              </div>

              {selectedUser && (
                <div className="bg-[var(--bg-subtle)] p-5 sm:p-6 rounded-b-2xl">
                  <div className="rounded-xl border border-[var(--border-main)] bg-white p-5 shadow-sm sm:p-6">
                    
                    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[var(--border-main)] pb-6 sm:flex-row sm:items-center">
                      <div className="flex items-start gap-4 overflow-hidden w-full">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-xl font-bold text-white uppercase">
                          {selectedUser.name ? selectedUser.name.charAt(0) : selectedUser.email.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-semibold text-[var(--text-main)]" title={selectedUser.name || selectedUser.email}>
                            {selectedUser.name || selectedUser.email}
                          </h3>
                          {selectedUser.name && (
                            <p className="truncate text-sm text-[var(--text-muted)]">
                              {selectedUser.email}
                            </p>
                          )}
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              selectedUser.role === 'admin' 
                                ? 'bg-purple-50 text-purple-700 ring-purple-600/20' 
                                : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                            }`}>
                              {selectedUser.role.toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              isUserActive
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : 'bg-red-50 text-red-700 ring-red-600/10'
                            }`}>
                              <svg className={`h-1.5 w-1.5 ${isUserActive ? 'fill-green-500' : 'fill-red-500'}`} viewBox="0 0 6 6" aria-hidden="true">
                                <circle cx="3" cy="3" r="3" />
                              </svg>
                              {isUserActive ? 'Active' : 'Soft Deleted'}
                            </span>
                            
                            {(selectedUser as unknown).mobile && (
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                📱 {(selectedUser as unknown).mobile}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <button
                        onClick={handleResetPassword}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-main)] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[var(--primary)]"
                      >
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Reset Password
                      </button>

                      {selectedUser.role !== "admin" && (
                        <button
                          onClick={() => {
                            const safeId = selectedUser.id || (selectedUser as unknown)._id;
                            router.push(`/admin/permissions?user=${safeId}`);
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-main)] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                        >
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Manage Permissions
                        </button>
                      )}

                      <div className="flex-1 sm:ml-auto">
                        <button
                          onClick={handleToggleStatus}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-all sm:w-auto sm:float-right ${
                            isUserActive
                              ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                              : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {isUserActive ? (
                            <>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              Soft Delete (Suspend)
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Restore User
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </AdminRoute>
  );
}