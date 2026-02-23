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

/* ================= PERMISSION HELPERS (FRONTEND) ================= */

const hasReadAccess = (
  permissions: string[],
  deptKey: string,
  subKey: string
) =>
  permissions.some(
    (p) =>
      p === `${deptKey}:${subKey}:read` ||
      p === `${deptKey}:${subKey}:write`
  );

const hasWriteAccess = (
  permissions: string[],
  deptKey: string,
  subKey: string
) =>
  permissions.includes(`${deptKey}:${subKey}:write`);

/* ================================================================= */

export default function DashboardPage() {
  
  const dispatch = useAppDispatch();

  const departments = useAppSelector((s) => s.departments);
  const subDepartments = useAppSelector((s) => s.subDepartments);
  const records = useAppSelector((s) => s.records.items);
  const user = useAppSelector((s) => s.auth.user);
  console.log(user);
  const permissions = user?.visibleSubDepartments || [];

  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeSubDept, setActiveSubDept] =
    useState<SubDepartment | null>(null);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    departments.forEach((d) => {
      dispatch(fetchSubDepartments(d.key));
    });
  }, [departments, dispatch]);

  /* ---------------- VISIBILITY FILTERING ---------------- */

  const visibleDepartments = useMemo(() => {
    if (user?.role === "admin") return departments;

    return departments.filter((dept) =>
      (subDepartments[dept.key] || []).some((sd) =>
        hasReadAccess(permissions, dept.key, sd.key)
      )
    );
  }, [departments, subDepartments, permissions, user]);

  const visibleSubDepartments = useMemo(() => {
    if (!activeDept) return [];

    const all = subDepartments[activeDept] || [];

    if (user?.role === "admin") return all;

    return all.filter((sd) =>
      hasReadAccess(permissions, activeDept, sd.key)
    );
  }, [activeDept, subDepartments, permissions, user]);

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
      <div className="flex min-h-screen flex-col bg-[var(--bg-subtle)] text-[var(--text-main)]">
        <Header />

        <main className="mx-auto w-full max-w-7xl p-6 sm:p-8">
          {/* BREADCRUMB */}
          <div className="mb-8 flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
            <span 
              className={`cursor-pointer transition-colors hover:text-[var(--primary)] ${!activeDept ? 'text-[var(--primary)]' : ''}`}
              onClick={() => setActiveDept(null)}
            >
              Dashboard
            </span>
            {activeDept && (
              <>
                <span className="text-[var(--text-light)]">/</span>
                <span 
                  className={`cursor-pointer transition-colors hover:text-[var(--primary)] ${!activeSubDept ? 'text-[var(--primary)]' : ''}`}
                  onClick={() => setActiveSubDept(null)}
                >
                  {activeDept}
                </span>
              </>
            )}
            {activeSubDept && (
              <>
                <span className="text-[var(--text-light)]">/</span>
                <span className="text-[var(--primary)]">{activeSubDept.name}</span>
              </>
            )}
          </div>

          {/* STEP 1: DEPARTMENTS */}
          {!activeDept && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="font-heading mb-8 text-3xl font-bold tracking-tight text-[var(--text-main)]">
                Departments
              </h1>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDepartments.map((dept) => (
                  <button
                    key={dept.key}
                    onClick={() => handleDepartmentClick(dept.key)}
                    className="group flex flex-col items-start justify-between rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-focus)] hover:shadow-md"
                  >
                    <div className="mb-4 rounded-full bg-[var(--bg-hover)] p-3 text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div className="font-heading text-xl font-semibold text-[var(--text-main)]">
                      {dept.name}
                    </div>
                    <div className="mt-2 flex w-full items-center justify-between text-sm font-medium text-[var(--text-muted)] transition-colors group-hover:text-[var(--primary)]">
                      <span>Open department</span>
                      <span>&rarr;</span>
                    </div>
                  </button>
                ))}
              </div>

              {visibleDepartments.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-main)] bg-[var(--bg-card)] py-12 text-center">
                  <span className="text-[var(--text-light)]">
                    <svg className="mx-auto mb-3 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </span>
                  <p className="text-[var(--text-muted)]">No departments assigned to you.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SUB-DEPARTMENTS */}
          {activeDept && !activeSubDept && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="font-heading mb-8 text-3xl font-bold tracking-tight text-[var(--text-main)]">
                Select Section
              </h1>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleSubDepartments.map((sd) => (
                  <button
                    key={sd.key}
                    onClick={() => handleSubDepartmentClick(sd)}
                    className="group flex items-center justify-between rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 text-left shadow-sm transition-all duration-200 hover:border-[var(--border-focus)] hover:bg-[var(--bg-hover)]"
                  >
                    <div className="font-medium text-[var(--text-main)]">{sd.name}</div>
                    <span className="text-[var(--border-main)] transition-colors group-hover:text-[var(--primary)]">
                      &rarr;
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveDept(null)}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
              >
                <span className="transition-transform group-hover:-translate-x-1">&larr;</span> 
                Back to departments
              </button>
            </div>
          )}

          {/* STEP 3: RECORDS */}
          {activeDept && activeSubDept && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-main)]">
                  {activeSubDept.name}
                </h1>
              </div>

              {/* WRITE ACCESS CHECK */}
              {user?.role === "admin" ||
              hasWriteAccess(
                permissions,
                activeDept,
                activeSubDept.key
              ) ? (
                <div className="mb-8 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm">
                  <RecordCreatePanel
                    departmentKey={activeDept}
                    subDepartment={activeSubDept}
                  />
                </div>
              ) : (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-[var(--primary-light)] bg-[var(--bg-hover)] p-4 text-sm font-medium text-[var(--secondary)] shadow-sm">
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  You have read-only access to this section.
                </div>
              )}

              <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm">
                <RecordList records={records} />
              </div>

              <button
                onClick={() => setActiveSubDept(null)}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
              >
                <span className="transition-transform group-hover:-translate-x-1">&larr;</span> 
                Back to sections
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}