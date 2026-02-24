"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  createRecord,
  uploadRecordFile,
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

  const [title, setTitle] = useState("");
  const [data, setData] = useState<Record<string, string | number | boolean>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- HANDLERS ---------------- */

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
      // 1. Create the base record
      const record = await dispatch(
        createRecord({
          departmentKey,
          subDepartmentKey: subDepartment.key,
          title: title.trim(),
          data,
        })
      ).unwrap();

      // 2. Upload any attached files
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

      // 3. Refresh the list to show the new record
      dispatch(fetchRecords({ departmentKey, subDepartmentKey: subDepartment.key }));

      // 4. Reset Form
      setTitle("");
      setData({});
      setFiles({});
      alert("Record created successfully!");

    } catch (error) {
      // console.error("Failed to create record:", error);
      // Better error formatting so it doesn't just say "{}"
      // const errorMsg = typeof error === 'string' ? error : error?.message || "Check your backend terminal for the exact error.";
      alert(`Failed to save the record`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const hasMissingRequiredFields = subDepartment.fields?.some(
    (field) => field.required && field.type !== 'file' && (data[field.key] === undefined || data[field.key] === "")
  );
  
  const hasMissingFiles = subDepartment.fields?.some(
    (field) => field.required && field.type === 'file' && !files[field.key]
  );

  const isFormValid = title.trim().length > 0 && !hasMissingRequiredFields && !hasMissingFiles;

  return (
    <div>
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

                  {field.type === "text" && (
                    <input
                      type="text"
                      className="w-full rounded-lg border border-[var(--border-main)] bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                      placeholder={`Enter ${field.name.toLowerCase()}...`}
                      value={(data[field.key] as string) || ""}
                      onChange={(e) => handleDataChange(field.key, e.target.value)}
                    />
                  )}

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
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full cursor-pointer rounded-lg border border-[var(--border-main)] bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] [&::-webkit-calendar-picker-indicator]:block [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                        value={data[field.key] ? (data[field.key] as string).substring(0, 10) : ""}
                        onChange={(e) => handleDataChange(field.key, e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
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
                      {/* REMOVED THE EXTRA LABEL HERE */}
                      <FileUploadField
                        field={field}
                        onSelect={(file) =>
                          setFiles((prev) => ({
                            ...prev,
                            [field.key]: file || new File([], ""), // Fallback if file is cleared
                          }))
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
        )}

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
  );
}