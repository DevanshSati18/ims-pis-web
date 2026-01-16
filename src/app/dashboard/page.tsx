"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import RecordCreatePanel from "@/components/RecordCreatePanel";
import RecordList from "@/components/RecordList";

import { fetchDepartments } from "@/store/departmentSlice";
import { fetchSubDepartments } from "@/store/subDepartmentSlice";
import { fetchRecords } from "@/store/recordSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SubDepartment } from "@/types/schema";

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const departments = useAppSelector((s) => s.departments);
  const subDepartments = useAppSelector((s) => s.subDepartments);
  const records = useAppSelector((s) => s.records.items);
  const user = useAppSelector((s) => s.auth.user);

  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeSubDept, setActiveSubDept] =
    useState<SubDepartment | null>(null);

  /* Load departments */
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  /* Load sub-departments for all departments */
  useEffect(() => {
    departments.forEach((d) => {
      dispatch(fetchSubDepartments(d.key));
    });
  }, [departments, dispatch]);

  /* ---------------- VISIBILITY FILTERING ---------------- */

  const visibleDepartments = useMemo(() => {
    if (user?.role === "admin") return departments;

    const allowed = user?.visibleSubDepartments || [];

    return departments.filter((dept) =>
      (subDepartments[dept.key] || []).some((sd) =>
        allowed.includes(`${dept.key}:${sd.key}`)
      )
    );
  }, [departments, subDepartments, user]);

  const visibleSubDepartments = useMemo(() => {
    if (!activeDept) return [];

    const all = subDepartments[activeDept] || [];

    if (user?.role === "admin") return all;

    const allowed = user?.visibleSubDepartments || [];
    return all.filter((sd) =>
      allowed.includes(`${activeDept}:${sd.key}`)
    );
  }, [activeDept, subDepartments, user]);

  /* ---------------- HANDLERS ---------------- */

  const handleDepartmentClick = (deptKey: string) => {
    setActiveDept(deptKey);
    setActiveSubDept(null);
  };

  const handleSubDepartmentClick = (sd: SubDepartment) => {
    setActiveSubDept(sd);
    dispatch(
      fetchRecords({
        departmentKey: activeDept as string,
        subDepartmentKey: sd.key,
      })
    );
  };

  /* ---------------- RENDER ---------------- */

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />

        <main className="mx-auto w-full max-w-7xl p-6">
          {/* BREADCRUMB */}
          <div className="mb-6 text-sm text-gray-600">
            Dashboard
            {activeDept && ` / ${activeDept}`}
            {activeSubDept && ` / ${activeSubDept.name}`}
          </div>

          {/* STEP 1: DEPARTMENT CARDS */}
          {!activeDept && (
            <>
              <h1 className="mb-6 text-2xl font-semibold">
                Departments
              </h1>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDepartments.map((dept) => (
                  <button
                    key={dept.key}
                    onClick={() =>
                      handleDepartmentClick(dept.key)
                    }
                    className="rounded-xl border bg-white p-6 text-left shadow-sm transition hover:shadow-md"
                  >
                    <div className="text-lg font-medium">
                      {dept.name}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Open department
                    </div>
                  </button>
                ))}
              </div>

              {visibleDepartments.length === 0 && (
                <div className="text-gray-500">
                  No departments available.
                </div>
              )}
            </>
          )}

          {/* STEP 2: SUB-DEPARTMENT BUTTONS */}
          {activeDept && !activeSubDept && (
            <>
              <h1 className="mb-6 text-2xl font-semibold">
                Select Section
              </h1>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleSubDepartments.map((sd) => (
                  <button
                    key={sd.key}
                    onClick={() =>
                      handleSubDepartmentClick(sd)
                    }
                    className="rounded-lg border bg-white p-4 text-left shadow-sm transition hover:bg-gray-50"
                  >
                    <div className="font-medium">{sd.name}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveDept(null)}
                className="mt-6 text-sm text-blue-600 hover:underline"
              >
                ← Back to departments
              </button>
            </>
          )}

          {/* STEP 3: RECORD VIEW */}
          {activeDept && activeSubDept && (
            <>
              <h1 className="mb-4 text-2xl font-semibold">
                {activeSubDept.name}
              </h1>

              <RecordCreatePanel
                departmentKey={activeDept}
                subDepartment={activeSubDept}
              />

              <div className="mt-8">
                <RecordList records={records} />
              </div>

              <button
                onClick={() => setActiveSubDept(null)}
                className="mt-6 text-sm text-blue-600 hover:underline"
              >
                ← Back to sections
              </button>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
