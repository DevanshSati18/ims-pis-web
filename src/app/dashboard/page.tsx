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

const hasReadAccess = (permissions: string[], deptKey: string, subKey: string) => {
  const targetRead = `${deptKey}:${subKey}:read`.toLowerCase();
  const targetWrite = `${deptKey}:${subKey}:write`.toLowerCase();
  return permissions.some(
    (p) => p.toLowerCase() === targetRead || p.toLowerCase() === targetWrite
  );
};

const hasWriteAccess = (permissions: string[], deptKey: string, subKey: string) => {
  const targetWrite = `${deptKey}:${subKey}:write`.toLowerCase();
  return permissions.some((p) => p.toLowerCase() === targetWrite);
};

/* ================================================================= */

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const departments = useAppSelector((s) => s.departments);
  const subDepartments = useAppSelector((s) => s.subDepartments);
  const records = useAppSelector((s) => s.records.items);
  const user = useAppSelector((s) => s.auth.user);
  
  const permissions = user?.visibleSubDepartments || [];

  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeSubDept, setActiveSubDept] = useState<SubDepartment | null>(null);

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

  // Determine user rights for the currently selected sub-department
  const isWriter = useMemo(() => {
    if (!activeDept || !activeSubDept) return false;
    return user?.role === "admin" || hasWriteAccess(permissions, activeDept, activeSubDept.key);
  }, [user, permissions, activeDept, activeSubDept]);

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
                Assigned Departments
              </h1>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDepartments.map((dept) => {
                  const accessibleCount = user?.role === "admin" 
                    ? (subDepartments[dept.key] || []).length 
                    : (subDepartments[dept.key] || []).filter(sd => hasReadAccess(permissions, dept.key, sd.key)).length;

                  return (
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
                        <span>{accessibleCount} accessible section{accessibleCount !== 1 && 's'}</span>
                        <span>&rarr;</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {visibleDepartments.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-main)] bg-[var(--bg-card)] py-12 text-center">
                  <p className="text-[var(--text-muted)]">No departments assigned to you.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SUB-DEPARTMENTS */}
          {activeDept && !activeSubDept && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <button
                onClick={() => setActiveDept(null)}
                className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
              >
                <span className="transition-transform group-hover:-translate-x-1">&larr;</span> 
                Back to departments
              </button>

              <h1 className="font-heading mb-8 text-3xl font-bold tracking-tight text-[var(--text-main)]">
                Select Section
              </h1>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleSubDepartments.map((sd) => {
                  return (
                    <button
                      key={sd.key}
                      onClick={() => handleSubDepartmentClick(sd)}
                      className="group flex items-center justify-between rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 text-left shadow-sm transition-all duration-200 hover:border-[var(--border-focus)] hover:bg-[var(--bg-hover)]"
                    >
                      <div className="font-medium text-[var(--text-main)] text-lg">{sd.name}</div>
                      <span className="text-[var(--border-main)] transition-colors group-hover:text-[var(--primary)]">
                        &rarr;
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: RECORDS */}
          {activeDept && activeSubDept && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <button
                onClick={() => setActiveSubDept(null)}
                className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
              >
                <span className="transition-transform group-hover:-translate-x-1">&larr;</span> 
                Back to sections
              </button>

              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-main)]">
                  {activeSubDept.name}
                </h1>
                
                {/* NEW: Sleek View-Only Badge */}
                {!isWriter && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Only Mode
                  </div>
                )}
              </div>

              {/* Only show creation panel if user has write access */}
              {isWriter && (
                <div className="mb-8 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm">
                  <RecordCreatePanel
                    departmentKey={activeDept}
                    subDepartment={activeSubDept}
                  />
                </div>
              )}

              {/* Pass the 'canEdit' prop down so RecordList knows whether to hide the buttons */}
              <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-[var(--text-main)] mb-4">
                  Recent Inventory Entries
                </h2>
                <RecordList 
                  records={records} 
                  subDepartment={activeSubDept} 
                  canEdit={isWriter} // NEW PROP
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}