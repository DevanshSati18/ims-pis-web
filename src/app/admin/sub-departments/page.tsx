"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDepartments } from "@/store/departmentSlice";
import {
  fetchSubDepartmentsAdmin,
  createSubDepartmentAdmin,
  deleteSubDepartmentAdmin,
} from "@/store/adminSubDepartmentSlice";
import { SubDepartmentField } from "@/types/schema";

export default function AdminSubDepartmentsPage() {
  const dispatch = useAppDispatch();
  const departments = useAppSelector((s) => s.departments);
  const { items } = useAppSelector(
    (s) => s.adminSubDepartments
  );

  const [selectedDept, setSelectedDept] =
    useState<string>("");
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [fields, setFields] = useState<SubDepartmentField[]>([]);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDept) {
      dispatch(fetchSubDepartmentsAdmin(selectedDept));
    }
  }, [selectedDept, dispatch]);

  const handleCreate = () => {
    if (!selectedDept || !name || !key) return;

    dispatch(
      createSubDepartmentAdmin({
        departmentKey: selectedDept,
        key,
        name,
        fields,
      })
    );

    setName("");
    setKey("");
    setFields([]);
  };

  const handleDelete = (sdKey: string) => {
    const confirm = window.confirm(
      "⚠️ This will permanently delete this sub-department.\nThis action cannot be undone.\n\nAre you sure?"
    );

    if (!confirm) return;

    dispatch(
      deleteSubDepartmentAdmin({
        departmentKey: selectedDept,
        key: sdKey,
      })
    );
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-5xl p-6">
          <h1 className="mb-6 text-2xl font-semibold">
            Sub-Departments
          </h1>

          {/* Department Selector */}
          <select
            className="mb-4 w-full border p-2"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.key} value={d.key}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Create */}
          {selectedDept && (
            <div className="mb-6 rounded border bg-white p-4">
              <h2 className="mb-3 font-medium">
                Create Sub-Department
              </h2>

              <input
                className="mb-2 w-full border p-2"
                placeholder="Key (e.g. noc)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <input
                className="mb-2 w-full border p-2"
                placeholder="Name (e.g. Fire NOC)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button
                onClick={handleCreate}
                className="rounded bg-blue-600 px-4 py-1 text-white"
              >
                Create
              </button>
            </div>
          )}

          {/* List */}
          <div className="rounded border bg-white">
            {items.map((sd) => (
              <div
                key={sd.key}
                className="flex items-center justify-between border-b p-4 last:border-b-0"
              >
                <div>
                  <div className="font-medium">{sd.name}</div>
                  <div className="text-sm text-gray-500">
                    Key: {sd.key}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(sd.key)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
