"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDepartments } from "@/store/departmentSlice";
import {
  fetchSubDepartmentsAdmin,
  createSubDepartmentAdmin,
  deleteSubDepartmentAdmin,
} from "@/store/adminSubDepartmentSlice";
import { SubDepartmentField, FieldType } from "@/types/schema"; // <-- Imported FieldType

// Local interface for our dynamic form builder
interface DynamicField {
  id: string; // Used locally for React keys to ensure smooth deleting/reordering
  name: string;
  type: FieldType; // <-- Now uses the exact types from your schema
  required: boolean;
  editable: boolean; 
}

export default function AdminSubDepartmentsPage() {
  const dispatch = useAppDispatch();
  const departments = useAppSelector((s) => s.departments);
  const { items } = useAppSelector((s) => s.adminSubDepartments);

  const [selectedDept, setSelectedDept] = useState<string>("");
  const [name, setName] = useState("");
  const [fields, setFields] = useState<DynamicField[]>([]);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDept) {
      dispatch(fetchSubDepartmentsAdmin(selectedDept));
    }
  }, [selectedDept, dispatch]);

  /* ---------------- DYNAMIC FIELD HANDLERS ---------------- */
  
  const addField = () => {
    setFields([
      ...fields,
      {
        id: Math.random().toString(36).substring(7),
        name: "",
        type: "text", // <-- Defaulted to "text" instead of "string"
        required: false,
        editable: false, 
      },
    ]);
  };

  const updateField = (id: string, key: keyof DynamicField, value: string | boolean) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, [key]: value } : field))
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  /* ---------------- SUBMISSION HANDLERS ---------------- */

  const handleCreate = () => {
    if (!selectedDept || !name.trim()) return;

    // Auto-generate Sub-Department Key
    const sdKey = name.trim().toLowerCase().replace(/\s+/g, "_");

    // Format fields to match the Redux schema
    const formattedFields: SubDepartmentField[] = fields.map((f) => ({
      name: f.name.trim(),
      key: f.name.trim().toLowerCase().replace(/\s+/g, "_"),
      type: f.type,
      required: f.required,
      editable: f.editable,
    }));

    dispatch(
      createSubDepartmentAdmin({
        departmentKey: selectedDept,
        key: sdKey,
        name: name.trim(),
        fields: formattedFields,
      })
    );

    // Reset form
    setName("");
    setFields([]);
  };

  const handleDelete = (sdKey: string) => {
    const confirm = window.confirm(
      "⚠️ This will permanently delete this sub-department and all its fields.\nThis action cannot be undone.\n\nAre you sure?"
    );

    if (!confirm) return;

    dispatch(
      deleteSubDepartmentAdmin({
        departmentKey: selectedDept,
        key: sdKey,
      })
    );
  };

  // Validation: Check if main name is empty OR if any added field is missing a name
  const isFormValid =
    name.trim().length > 0 &&
    fields.every((f) => f.name.trim().length > 0);

  return (
    <AdminRoute>
      <div className="flex min-h-screen flex-col bg-[var(--bg-subtle)] text-[var(--text-main)]">
        <Header />

        <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          
          {/* BREADCRUMB & HEADER */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Link
              href="/admin"
              className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
            >
              <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
              Back to Admin Console
            </Link>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">
              Sub-Departments & Schemas
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
              Select a department to define its specific sections and required inventory fields.
            </p>
          </div>

          {/* STEP 1: SELECT DEPARTMENT */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
            <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-6">
              <label className="mb-2 block text-sm font-semibold text-[var(--text-main)]">
                1. Select Parent Department
              </label>
              <select
                className="w-full appearance-none rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-3 text-sm font-medium outline-none transition-all hover:border-[var(--primary-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">-- Choose a Department --</option>
                {departments.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.name} ({d.key})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedDept && (
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* LEFT COLUMN: CREATE FORM */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-6">
                  <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-main)] pb-4">
                    <div className="rounded-lg bg-[var(--primary-soft)] p-2 text-[var(--primary)]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="font-heading text-lg font-semibold text-[var(--text-main)] sm:text-xl">
                      2. Define Sub-Department
                    </h2>
                  </div>

                  {/* Sub-Department Name */}
                  <div className="mb-8">
                    <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                      Section Name
                    </label>
                    <input
                      className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--text-light)] hover:border-[var(--primary-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                      placeholder="e.g. Science Lab Equipment"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {name && (
                      <p className="mt-2 text-xs text-[var(--text-light)]">
                        Generated Key: <strong className="text-[var(--primary)]">{name.trim().toLowerCase().replace(/\s+/g, "_")}</strong>
                      </p>
                    )}
                  </div>

                  {/* DYNAMIC FIELDS BUILDER */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-semibold text-[var(--text-main)]">
                        Custom Fields / Schema
                      </label>
                      <span className="rounded-full bg-[var(--bg-hover)] px-2.5 py-0.5 text-xs font-medium text-[var(--primary)]">
                        {fields.length} Field{fields.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {fields.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[var(--border-main)] bg-[var(--bg-subtle)] p-6 text-center text-sm text-[var(--text-muted)]">
                          No custom fields added yet. The system will only track basic default info.
                        </div>
                      )}

                      {fields.map((field, index) => (
                        <div key={field.id} className="group relative flex flex-col gap-4 rounded-xl border border-[var(--border-main)] bg-white p-4 shadow-sm transition-all hover:border-[var(--primary-light)]">
                          
                          {/* Field Number Badge */}
                          <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white shadow-sm">
                            {index + 1}
                          </div>

                          {/* Top Row: Name and Type */}
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                              <input
                                className="w-full rounded-lg border border-[var(--border-main)] bg-[var(--bg-subtle)] px-3 py-2 text-sm outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-soft)]"
                                placeholder="Field Name (e.g. Serial Number)"
                                value={field.name}
                                onChange={(e) => updateField(field.id, "name", e.target.value)}
                              />
                            </div>
                            <div className="w-full sm:w-40">
                              <select
                                className="w-full rounded-lg border border-[var(--border-main)] bg-[var(--bg-subtle)] px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-soft)]"
                                value={field.type}
                                onChange={(e) => updateField(field.id, "type", e.target.value as FieldType)}
                              >
                                <option value="text">Text (String)</option>
                                <option value="number">Number (Integer)</option>
                                <option value="date">Date</option>
                                <option value="file">File Upload</option>
                                <option value="boolean">Yes/No (Boolean)</option>
                              </select>
                            </div>
                          </div>

                          {/* Bottom Row: Checkboxes and Delete */}
                          <div className="flex items-center justify-between border-t border-[var(--border-main)] pt-3">
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                              {/* Required Checkbox */}
                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 cursor-pointer rounded border-[var(--border-main)] text-[var(--primary)] focus:ring-[var(--primary)]"
                                  checked={field.required}
                                  onChange={(e) => updateField(field.id, "required", e.target.checked)}
                                />
                                <span className="text-sm font-medium text-[var(--text-main)]">Required</span>
                              </label>

                              {/* Editable Checkbox */}
                              <label className="flex cursor-pointer items-center gap-2" title="Can this be updated later when editing a record?">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 cursor-pointer rounded border-[var(--border-main)] text-[var(--primary)] focus:ring-[var(--primary)]"
                                  checked={field.editable}
                                  onChange={(e) => updateField(field.id, "editable", e.target.checked)}
                                />
                                <span className="text-sm font-medium text-[var(--text-main)]">Editable Later</span>
                              </label>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeField(field.id)}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-light)] transition-colors hover:bg-red-50 hover:text-[var(--danger)]"
                              title="Remove Field"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addField}
                      className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--bg-hover)]"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Custom Field
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 border-t border-[var(--border-main)] pt-6">
                    <button
                      onClick={handleCreate}
                      disabled={!isFormValid}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all 
                        ${!isFormValid 
                          ? 'cursor-not-allowed bg-[var(--primary-light)] opacity-70' 
                          : 'bg-[var(--primary)] shadow-md hover:bg-[var(--secondary)] hover:shadow-lg active:scale-[0.98]'
                        }`}
                    >
                      Save Sub-Department
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: LISTING */}
              <div className="lg:col-span-5">
                <div className="sticky top-24 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-sm">
                  <div className="border-b border-[var(--border-main)] bg-[var(--bg-subtle)] px-5 py-4 sm:px-6 rounded-t-2xl">
                    <h2 className="font-heading text-lg font-semibold text-[var(--text-main)]">
                      Existing Sections
                    </h2>
                  </div>

                  <div className="p-2">
                    {items.length === 0 ? (
                      <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                        No sub-departments found for this department yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {items.map((sd) => (
                          <div
                            key={sd.key}
                            className="group flex items-start justify-between rounded-xl p-3 sm:p-4 transition-colors hover:bg-[var(--bg-hover)]"
                          >
                            <div className="flex items-start gap-3 overflow-hidden">
                              <div className="mt-0.5 shrink-0 text-[var(--primary-light)] group-hover:text-[var(--primary)]">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="truncate font-medium text-[var(--text-main)]">{sd.name}</div>
                                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
                                  <span>Key: <strong className="font-mono text-[var(--text-main)]">{sd.key}</strong></span>
                                  <span className="hidden sm:inline">•</span>
                                  <span>{sd.fields?.length || 0} Custom Fields</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDelete(sd.key)}
                              className="ml-2 shrink-0 rounded bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 opacity-0 transition-all hover:bg-red-100 hover:text-red-700 group-hover:opacity-100 focus:opacity-100 sm:ml-4"
                              title="Delete Section"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminRoute>
  );
}