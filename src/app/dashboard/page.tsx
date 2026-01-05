"use client";

import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { fetchDepartments } from "@/store/departmentSlice";
import { fetchSubDepartments } from "@/store/subDepartmentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const departments = useAppSelector(
    (state) => state.departments
  );
  const subDepartments = useAppSelector(
    (state) => state.subDepartments
  );

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    departments.forEach((d) => {
      dispatch(fetchSubDepartments(d.key));
    });
  }, [departments, dispatch]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header />

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-64 border-r p-4">
            <h2 className="mb-4 font-bold">Departments</h2>

            {departments.map((d) => (
              <div key={d.key} className="mb-3">
                <div className="font-semibold">{d.name}</div>
                <ul className="ml-4 text-sm">
                  {(subDepartments[d.key] || []).map((s) => (
                    <li key={s.key}>{s.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Logout & header integrated successfully.
            </p>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
