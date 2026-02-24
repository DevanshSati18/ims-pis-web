"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDepartmentsAdmin,
  createDepartmentAdmin,
  deleteDepartmentAdmin,
} from "@/store/adminDepartmentSlice";

export default function AdminDepartmentsPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.adminDepartments);

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DELETE MODAL STATE ---
  const [deptToDelete, setDeptToDelete] = useState<{ key: string; name: string } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartmentsAdmin());
  }, [dispatch]);

  /* ---------------- CREATE HANDLER ---------------- */
  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      const generatedKey = name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "_");
      await dispatch(createDepartmentAdmin({ name: name.trim(), key: generatedKey })).unwrap();
      setName("");
    } catch (error) {
      alert("Failed to create department. It may already exist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate();
  };

  /* ---------------- DELETE HANDLER ---------------- */
  const confirmDelete = async () => {
    if (!deptToDelete) return;
    setIsDeleting(true);

    try {
      await dispatch(deleteDepartmentAdmin(deptToDelete.key)).unwrap();
      setDeptToDelete(null);
      setDeleteConfirmText("");
    } catch (error) {
      alert("Failed to delete department. Ensure you have backend permissions.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeptToDelete(null);
    setDeleteConfirmText("");
  };

  // Helper to format the MongoDB timestamp elegantly
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen flex-col bg-[var(--bg-subtle)] text-[var(--text-main)]">
        <Header />

        <main className="mx-auto w-full max-w-5xl p-6 sm:p-8">
          
          {/* BREADCRUMB & HEADER */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Link 
              href="/admin" 
              className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
            >
              <span className="transition-transform group-hover:-translate-x-1">&larr;</span> 
              Back to Admin Console
            </Link>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Departments Management
            </h1>
            <p className="mt-2 text-[var(--text-muted)]">
              Create and manage the root departments for the school inventory.
            </p>
          </div>

          {/* CREATE SECTION */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
            <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-[var(--primary-soft)] p-2 text-[var(--primary)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="font-heading text-xl font-semibold text-[var(--text-main)]">
                  Create New Department
                </h2>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                    Department Name
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--text-light)] hover:border-[var(--primary-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                    placeholder="e.g. Science Lab"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                
                <button
                  onClick={handleCreate}
                  disabled={!name.trim() || isSubmitting}
                  className={`flex h-[42px] w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all sm:w-auto
                    ${(!name.trim() || isSubmitting) 
                      ? 'cursor-not-allowed bg-[var(--primary-light)] opacity-70' 
                      : 'bg-[var(--primary)] shadow-md hover:bg-[var(--secondary)] hover:shadow-md active:scale-95'
                    }`}
                >
                  {isSubmitting ? 'Adding...' : 'Add Department'}
                </button>
              </div>
            </div>
          </div>

          {/* LIST SECTION */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="mb-4 font-heading text-xl font-semibold text-[var(--text-main)]">
              Existing Departments
            </h2>
            <div className="overflow-hidden rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-sm">
              
              {loading && (
                <div className="flex items-center justify-center p-8 text-[var(--text-muted)]">
                  <svg className="mr-3 h-6 w-6 animate-spin text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading departments...
                </div>
              )}

              {!loading && items.length === 0 && (
                <div className="p-8 text-center text-[var(--text-muted)]">
                  No departments found. Create one above to get started.
                </div>
              )}

              {!loading && items.map((d) => (
                <div
                  key={d.key}
                  className="group flex flex-col justify-between gap-4 border-b border-[var(--border-main)] p-5 transition-colors hover:bg-[var(--bg-hover)] last:border-b-0 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-subtle)] text-[var(--text-muted)] transition-colors group-hover:bg-[var(--primary-soft)] group-hover:text-[var(--primary)]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-[var(--text-main)] transition-colors group-hover:text-[var(--primary)]">
                        {d.name}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-[var(--border-main)] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[var(--text-main)]">Key</span>
                          <span className="font-mono text-[var(--text-main)]">{d.key}</span>
                        </div>
                        
                        {/* NEW: Last Updated Display */}
                        <div className="flex items-center gap-1.5 text-[var(--text-light)]">
                          <span className="hidden sm:inline">•</span>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Updated {d.updatedAt ? formatDate(d?.updatedAt) : "Recently"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FIXED: Mobile Visibility and Styling */}
                  <button
                    onClick={() => setDeptToDelete({ key: d.key, name: d.name })}
                    className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:border-red-200 hover:bg-red-100 hover:text-red-700 focus:opacity-100 sm:w-auto sm:border-transparent sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="sm:hidden">Delete Department</span>
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deptToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold">Delete Department?</h3>
            </div>
            
            <p className="mb-4 text-sm text-[var(--text-muted)]">
              This action cannot be undone. All sub-departments and records inside <strong className="text-[var(--text-main)]">{deptToDelete.name}</strong> will also be deleted or orphaned depending on backend rules.
            </p>

            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <label className="mb-2 block text-sm font-medium text-red-800">
                Type <strong className="font-bold">{deptToDelete.name}</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                placeholder={deptToDelete.name}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="rounded-xl border border-[var(--border-main)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteConfirmText !== deptToDelete.name || isDeleting}
                className={`rounded-xl px-5 py-2 text-sm font-bold text-white transition-all 
                  ${deleteConfirmText === deptToDelete.name && !isDeleting
                    ? 'bg-red-600 hover:bg-red-700 shadow-md active:scale-95' 
                    : 'bg-red-300 cursor-not-allowed'
                  }`}
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminRoute>
  );
}