"use client";

import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import Link from "next/link";

export default function AdminHome() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-6xl p-6">
          <h1 className="mb-6 text-2xl font-semibold">
            Admin Console
          </h1>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AdminCard
              title="Departments"
              href="/admin/departments"
              description="Create and manage departments"
            />
            <AdminCard
              title="Sub-Departments"
              href="/admin/sub-departments"
              description="Define sections & schemas"
            />
            <AdminCard
              title="Users"
              href="/admin/users"
              description="Create users & reset access"
            />
            <AdminCard
              title="Permissions"
              href="/admin/permissions"
              description="Assign read/write access"
            />
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
}: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="text-lg font-medium">{title}</div>
      <div className="mt-2 text-sm text-gray-500">
        {description}
      </div>
    </Link>
  );
}
