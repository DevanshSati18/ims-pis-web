"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
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
  const [key, setKey] = useState("");

  useEffect(() => {
    dispatch(fetchDepartmentsAdmin());
  }, [dispatch]);

  const handleCreate = () => {
    if (!name || !key) return;
    dispatch(createDepartmentAdmin({ name, key }));
    setName("");
    setKey("");
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-5xl p-6">
          <h1 className="mb-6 text-2xl font-semibold">
            Departments
          </h1>

          {/* Create */}
          <div className="mb-6 rounded-lg border bg-white p-4">
            <h2 className="mb-3 font-medium">
              Create Department
            </h2>

            <div className="flex gap-3">
              <input
                className="flex-1 border p-2"
                placeholder="Key (e.g. fire)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <input
                className="flex-1 border p-2"
                placeholder="Name (e.g. Fire Department)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                onClick={handleCreate}
                className="rounded bg-blue-600 px-4 text-white"
              >
                Add
              </button>
            </div>
          </div>

          {/* List */}
          <div className="rounded-lg border bg-white">
            {loading && (
              <div className="p-4 text-gray-500">
                Loading…
              </div>
            )}

            {items.map((d) => (
              <div
                key={d.key}
                className="border-b p-4 last:border-b-0"
              >
                <div className="font-medium">{d.name}</div>
                <div className="text-sm text-gray-500">
                  Key: {d.key}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
