"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import InventoryPanel from "@/components/InventoryPanel";
import { fetchDepartments } from "@/store/departmentSlice";
import { fetchSubDepartments } from "@/store/subDepartmentSlice";
import { fetchInventoryBySubDept } from "@/store/inventorySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const departments = useAppSelector((s) => s.departments);
  const subDepartments = useAppSelector((s) => s.subDepartments);

  const [selectedSubDept, setSelectedSubDept] =
    useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    departments.forEach((d) => {
      dispatch(fetchSubDepartments(d.key));
    });
  }, [departments, dispatch]);

  const handleSubDeptClick = (key: string) => {
    setSelectedSubDept(key);
    dispatch(fetchInventoryBySubDept(key));
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
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
                    <li key={s.key}>
                      <button
                        className={`hover:underline ${
                          selectedSubDept === s.key
                            ? "font-semibold"
                            : ""
                        }`}
                        onClick={() => handleSubDeptClick(s.key)}
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Main */}
          <main className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Inventory</h1>
            <InventoryPanel subDepartmentKey={selectedSubDept} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
