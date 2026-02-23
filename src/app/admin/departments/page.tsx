"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDepartmentsAdmin,
  createDepartmentAdmin,
} from "@/store/adminDepartmentSlice";

export default function AdminDepartmentsPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(
    (s) => s.adminDepartments
  );

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchDepartmentsAdmin());
  }, [dispatch]);

  const handleCreate = () => {
    // Prevent empty submissions
    if (!name.trim()) return;

    // Automatically generate the key: lowercase and replace spaces with underscores
    const generatedKey = name.trim().toLowerCase().replace(/\s+/g, "_");

    dispatch(createDepartmentAdmin({ name: name.trim(), key: generatedKey }));
    setName("");
  };

  // Allow pressing "Enter" to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen flex-col bg-(--bg-subtle) text-[var(--text-main)]">
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
                  disabled={!name.trim()}
                  className={`flex h-[42px] w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all sm:w-auto
                    ${!name.trim() 
                      ? 'cursor-not-allowed bg-[var(--primary-light)] opacity-70' 
                      : 'bg-[var(--primary)] shadow-sm hover:bg-[var(--secondary)] hover:shadow-md active:scale-95'
                    }`}
                >
                  <span>Add Department</span>
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
                  className="group flex flex-col justify-between border-b border-[var(--border-main)] p-5 transition-colors hover:bg-[var(--bg-hover)] last:border-b-0 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-subtle)] text-[var(--text-muted)] transition-colors group-hover:bg-[var(--primary-soft)] group-hover:text-[var(--primary)]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-main)] transition-colors group-hover:text-[var(--primary)]">
                        {d.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <span className="rounded bg-[var(--border-main)] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[var(--text-main)]">Generated Key</span>
                        {d.key}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}