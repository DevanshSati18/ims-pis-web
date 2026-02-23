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
import { SubDepartmentField, FieldType } from "@/types/schema";

// Local interface for our dynamic form builder
interface DynamicField {
  id: string; 
  name: string;
  type: FieldType;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        type: "text", // FIXED: Changed from "string" to match FieldType
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

  /* ---------------- PAYLOAD LOGGER (FOR DEBUGGING) ---------------- */
  
  const logSchemaPayload = (
    deptKey: string, 
    sdKey: string, 
    sdName: string, 
    formattedFields: SubDepartmentField[]
  ) => {
    console.group("🚀 SUBMITTING NEW SUB-DEPARTMENT SCHEMA");
    console.log(`📂 Parent Dept Key: "${deptKey}"`);
    console.log(`📁 Sub-Dept Name: "${sdName}"`);
    console.log(`🔑 Auto-Generated Sub-Dept Key: "${sdKey}"`);
    console.log(`📋 Total Custom Fields: ${formattedFields.length}`);
    console.table(formattedFields);
    console.log("JSON Payload expected by Backend:", JSON.stringify({
      departmentKey: deptKey,
      key: sdKey,
      name: sdName,
      fields: formattedFields
    }, null, 2));
    console.groupEnd();
  };

  /* ---------------- SUBMISSION HANDLERS ---------------- */

  const handleCreate = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!selectedDept || !name.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Bulletproof Key Generation
      const generateKey = (str: string) => 
        str.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "_");

      // FIXED: Actually use the function to generate the key
      const sdKey = generateKey(name);

      // Format fields to match the Redux schema
      const formattedFields: SubDepartmentField[] = fields.map((f) => ({
        name: f.name.trim(),
        key: generateKey(f.name), // Use bulletproof generation for fields too
        type: f.type,
        required: f.required,
        editable: f.editable, 
      }));

      // Call the debugger for visibility
      logSchemaPayload(selectedDept, sdKey, name.trim(), formattedFields);

      // FIXED: Added `await` and passed the correct `sdKey`
      await dispatch(
        createSubDepartmentAdmin({
          departmentKey: selectedDept,
          key: sdKey,
          name: name.trim(),
          fields: formattedFields,
        })
      ).unwrap();

      // 5. Force Refetch
      dispatch(fetchSubDepartmentsAdmin(selectedDept));

      // 6. Reset form only on success
      setName("");
      setFields([]);
      
    } catch (error) {
      console.error("Failed to create Sub-Department:", error);
      alert("Failed to create the section. Please check if the name already exists or if your backend accepts the new 'editable' parameter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (sdKey: string) => {
    const confirm = window.confirm(
      "⚠️ This will permanently delete this sub-department and all its fields.\nThis action cannot be undone.\n\nAre you sure?"
    );

    if (!confirm) return;

    await dispatch(
      deleteSubDepartmentAdmin({
        departmentKey: selectedDept,
        key: sdKey,
      })
    );
    
    dispatch(fetchSubDepartmentsAdmin(selectedDept));
  };

  /* ---------------- VALIDATION ---------------- */
  const hasEmptyCustomField = fields.some((f) => f.name.trim().length === 0);
  const isFormValid = name.trim().length > 0 && !hasEmptyCustomField;

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
                        Generated Key: <strong className="text-[var(--primary)]">{name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "_")}</strong>
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
                        <div key={field.id} className={`group relative flex flex-col gap-4 rounded-xl border p-4 shadow-sm transition-all ${field.name.trim() === '' ? 'border-red-300 bg-red-50' : 'border-[var(--border-main)] bg-white hover:border-[var(--primary-light)]'}`}>
                          
                          {/* Field Number Badge */}
                          <div className={`absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${field.name.trim() === '' ? 'bg-[var(--danger)]' : 'bg-[var(--primary)]'}`}>
                            {index + 1}
                          </div>

                          {/* Top Row: Name and Type */}
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                              <input
                                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all focus:ring-2 ${field.name.trim() === '' ? 'border-red-300 bg-white focus:border-[var(--danger)] focus:ring-red-100 placeholder:text-red-300' : 'border-[var(--border-main)] bg-[var(--bg-subtle)] focus:border-[var(--primary)] focus:bg-white focus:ring-[var(--primary-soft)] placeholder:text-[var(--text-light)]'}`}
                                placeholder="Field Name (e.g. Serial Number)"
                                value={field.name}
                                onChange={(e) => updateField(field.id, "name", e.target.value)}
                              />
                            </div>
                            <div className="w-full sm:w-40">
                              {/* FIXED: Mapped option values strictly to FieldType string literals */}
                              <select
                                className="w-full rounded-lg border border-[var(--border-main)] bg-[var(--bg-subtle)] px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-soft)]"
                                value={field.type}
                                onChange={(e) => updateField(field.id, "type", e.target.value as FieldType)}
                              >
                                <option value="text">Text (String)</option>
                                <option value="number">Number (Integer)</option>
                                <option value="date">Date</option>
                                <option value="file">File Upload</option>
                                <option value="boolean">Yes/No</option>
                              </select>
                            </div>
                          </div>

                          {/* Bottom Row: Checkboxes and Delete */}
                          <div className={`flex items-center justify-between border-t pt-3 ${field.name.trim() === '' ? 'border-red-200' : 'border-[var(--border-main)]'}`}>
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
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${field.name.trim() === '' ? 'text-[var(--danger)] hover:bg-red-100' : 'text-[var(--text-light)] hover:bg-red-50 hover:text-[var(--danger)]'}`}
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

                  {/* Submit Button & Validation Messages */}
                  <div className="mt-8 border-t border-[var(--border-main)] pt-6">
                    {hasEmptyCustomField && (
                      <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[var(--danger)]">
                        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Please provide a name for all custom fields before saving.
                      </div>
                    )}
                    <button
                      onClick={handleCreate}
                      disabled={!isFormValid || isSubmitting}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all 
                        ${(!isFormValid || isSubmitting)
                          ? 'cursor-not-allowed bg-[var(--primary-light)] opacity-70' 
                          : 'bg-[var(--primary)] shadow-md hover:bg-[var(--secondary)] hover:shadow-lg active:scale-[0.98]'
                        }`}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Sub-Department'}
                      {!isSubmitting && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
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