"use client";

import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import Link from "next/link";

export default function AdminHome() {
  return (
    <AdminRoute>
      <div className="flex min-h-screen flex-col bg-[var(--bg-subtle)] text-[var(--text-main)]">
        <Header />

        <main className="mx-auto w-full max-w-7xl p-6 sm:p-8">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-[var(--primary-soft)] px-2 py-1 text-xs font-semibold tracking-wider text-[var(--secondary)] uppercase">
                System Management
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Admin Console
            </h1>
            <p className="mt-2 text-[var(--text-muted)]">
              Manage school departments, staff access, and inventory permissions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <AdminCard
              title="Departments"
              href="/admin/departments"
              description="Create and manage root departments."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <AdminCard
              title="Sub-Departments"
              href="/admin/sub-departments"
              description="Define sections & specific schemas."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              }
            />
            <AdminCard
              title="Users"
              href="/admin/users"
              description="Create staff users & manage accounts."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            
            {/* PERMISSIONS CARD HIDDEN FROM DASHBOARD 
                Accessible only through the Users Management page as requested.
            <AdminCard
              title="Permissions"
              href="/admin/permissions"
              description="Assign read/write access to staff."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
            */}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}

function AdminCard({
  title,
  href,
  description,
  icon,
}: {
  title: string;
  href: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-focus)] hover:shadow-md"
    >
      <div>
        {icon && (
          <div className="mb-4 inline-flex rounded-xl bg-[var(--bg-hover)] p-3 text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
            {icon}
          </div>
        )}
        <div className="font-heading text-xl font-semibold text-[var(--text-main)] transition-colors group-hover:text-[var(--primary)]">
          {title}
        </div>
        <div className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
          {description}
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--text-light)] transition-colors group-hover:text-[var(--primary)]">
        <span>Manage</span>
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  );
}