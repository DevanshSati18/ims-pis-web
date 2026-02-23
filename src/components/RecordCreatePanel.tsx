"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createRecord,
  uploadRecordFile,
  deleteRecord, 
  fetchRecords,
} from "@/store/recordSlice";
import FileUploadField from "./FileUploadField";
import { SubDepartment } from "@/types/schema";

interface Props {
  departmentKey: string;
  subDepartment: SubDepartment;
}

export default function RecordCreatePanel({
  departmentKey,
  subDepartment,
}: Props) {
  const dispatch = useAppDispatch();
  
  const records = useAppSelector((s) => s.records.items);
  const loading = useAppSelector((s) => s.records.loading);

  const [title, setTitle] = useState("");
  // State to hold the dynamic data based on the schema
  const [data, setData] = useState<Record<string, string | number | boolean>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- HANDLERS ---------------- */

  // Helper to safely update the dynamic data state based on input type
  const handleDataChange = (key: string, value: string | number | boolean) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      const record = await dispatch(
        createRecord({
          departmentKey,
          subDepartmentKey: subDepartment.key,
          title: title.trim(),
          data,
        })
      ).unwrap();

      const fileUploadPromises = Object.keys(files).map((fieldKey) =>
        dispatch(
          uploadRecordFile({
            recordId: record._id,
            fieldKey,
            file: files[fieldKey],
          })
        ).unwrap()
      );

      if (fileUploadPromises.length > 0) {
        await Promise.all(fileUploadPromises);
      }

      dispatch(fetchRecords({ departmentKey, subDepartmentKey: subDepartment.key }));

      setTitle("");
      setData({});
      setFiles({});
      alert("Record created successfully!");

    } catch (error) {
      console.error("Failed to create record:", error);
      alert("Failed to save the record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this record from the inventory?\nThis action will be logged."
    );

    if (!confirm) return;

    try {
      await dispatch(deleteRecord(recordId)).unwrap();
      dispatch(fetchRecords({ departmentKey, subDepartmentKey: subDepartment.key }));
    } catch (error) {
      console.error("Failed to delete record:", error);
      alert("Failed to delete the record. You may not have permission.");
    }
  };

  /* ---------------- VALIDATION ---------------- */
  // Check if title exists AND if all required fields from the schema are filled
  const hasMissingRequiredFields = subDepartment.fields?.some(
    (field) => field.required && field.type !== 'file' && (data[field.key] === undefined || data[field.key] === "")
  );
  
  const hasMissingFiles = subDepartment.fields?.some(
    (field) => field.required && field.type === 'file' && !files[field.key]
  );

  const isFormValid = title.trim().length > 0 && !hasMissingRequiredFields && !hasMissingFiles;

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* LEFT COLUMN: CREATE FORM */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-main)] pb-4">
            <div className="rounded-lg bg-[var(--primary-soft)] p-2 text-[var(--primary)]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-[var(--text-main)] sm:text-xl">
                Add New Entry
              </h2>
              <p className="text-sm text-[var(--text-muted)]">Logging into: <strong className="text-[var(--primary)]">{subDepartment.name}</strong></p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Standard Field: Title */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--text-main)]">
                Record Title <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-3 text-sm outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]"
                placeholder="e.g. Dell Optiplex 7090 - Lab 3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* DYNAMIC SCHEMA FIELDS (Matching Admin Panel Style) */}
            {subDepartment.fields && subDepartment.fields.filter(f => f.type !== 'file').length > 0 && (
              <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-subtle)] p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Section Details
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {subDepartment.fields
                    .filter(f => f.type !== 'file')
                    .map((field) => (
                    <div key={field.key} className="flex flex-col">
                      <label className="mb-1.5 text-sm font-medium text-[var(--text-main)]">
                        {field.name} {field.required && <span className="text-[var(--danger)]">*</span>}
                      </label>

                      {/* FIXED: Changed "string" to "text" to match FieldType */}
                      {field.type === "text" && (
                        <input
                          type="text"
                          className="w-full rounded-lg border border-[var(--border-main)] bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                          placeholder={`Enter ${field.name.toLowerCase()}...`}
                          value={(data[field.key] as string) || ""}
                          onChange={(e) => handleDataChange(field.key, e.target.value)}
                        />
                      )}

                      {/* FIXED: Changed "integer" to "number" to match FieldType */}
                      {field.type === "number" && (
                        <input
                          type="number"
                          className="w-full rounded-lg border border-[var(--border-main)] bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                          placeholder="0"
                          value={(data[field.key] as number) || ""}
                          onChange={(e) => handleDataChange(field.key, Number(e.target.value))}
                        />
                      )}

                      {field.type === "date" && (
                        <input
                          type="date"
                          className="w-full rounded-lg border border-[var(--border-main)] bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                          value={(data[field.key] as string) || ""}
                          onChange={(e) => handleDataChange(field.key, e.target.value)}
                        />
                      )}

                      {field.type === "boolean" && (
                        <select
                          className="w-full rounded-lg border border-[var(--border-main)] bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                          value={data[field.key] !== undefined ? String(data[field.key]) : ""}
                          onChange={(e) => handleDataChange(field.key, e.target.value === "true")}
                        >
                          <option value="" disabled>Select option...</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FILE UPLOADS */}
            {subDepartment.fields?.filter((f) => f.type === "file").length > 0 && (
              <div className="rounded-xl border border-dashed border-[var(--primary-light)] bg-orange-50/50 p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Required Attachments
                </h3>
                <div className="space-y-4">
                  {subDepartment.fields
                    .filter((f) => f.type === "file")
                    .map((field) => (
                      <div key={field.key} className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-[var(--text-main)]">
                          {field.name} {field.required && <span className="text-[var(--danger)]">*</span>}
                        </label>
                        <FileUploadField
                          field={field}
                          onSelect={(file) =>
                            setFiles((prev) => ({
                              ...prev,
                              [field.key]: file,
                            }))
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Submit Button & Validation Feedback */}
            <div className="pt-2 border-t border-[var(--border-main)]">
              {(!isFormValid && title.trim().length > 0) && (
                <p className="mb-3 text-sm text-[var(--danger)] text-center">
                  Please fill out all required fields before submitting.
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all 
                  ${(!isFormValid || isSubmitting)
                    ? 'cursor-not-allowed bg-[var(--primary-light)] opacity-70' 
                    : 'bg-[var(--primary)] shadow-md hover:bg-[var(--secondary)] hover:shadow-lg active:scale-[0.98]'
                  }`}
              >
                {isSubmitting ? 'Saving Record...' : 'Submit Entry'}
                {!isSubmitting && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LISTING */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-sm">
          <div className="border-b border-[var(--border-main)] bg-[var(--bg-subtle)] px-5 py-4 sm:px-6 rounded-t-2xl">
            <h2 className="font-heading text-lg font-semibold text-[var(--text-main)]">
              Recent Inventory Entries
            </h2>
          </div>

          <div className="p-2 sm:p-3">
            {loading ? (
              <div className="flex items-center justify-center p-8 text-[var(--text-muted)]">
                <svg className="mr-3 h-5 w-5 animate-spin text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading records...
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-main)] bg-[var(--bg-subtle)] p-8 text-center text-[var(--text-muted)]">
                <svg className="mb-3 h-8 w-8 text-[var(--text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm">No records found for this section.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {/* FIXED: Changed 'unknwon' to 'any' to fix TypeScript error */}
                {records.map((record: any) => (
                  <div
                    key={record._id}
                    className="group flex flex-col justify-between gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-[var(--border-main)] hover:bg-[var(--bg-hover)] sm:flex-row sm:items-center sm:p-4"
                  >
                    <div className="flex items-start gap-3 overflow-hidden">
                      <div className="mt-1 shrink-0 text-[var(--primary-light)] group-hover:text-[var(--primary)]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-[var(--text-main)]">{record.title}</div>
                        <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                          {Object.keys(record.data || {}).length} Fields Logged
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(record._id)}
                      className="shrink-0 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 opacity-0 transition-all hover:bg-red-100 hover:text-red-700 group-hover:opacity-100 focus:opacity-100 sm:ml-4"
                      title="Delete Record"
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
  );
}