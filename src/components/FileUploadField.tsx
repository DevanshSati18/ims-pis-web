"use client";

import { useState } from "react";
import { SubDepartmentField } from "@/types/schema";

interface Props {
  field: SubDepartmentField;
  onSelect: (file: File | null) => void;
}

export default function FileUploadField({ field, onSelect }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onSelect(file);
    } else {
      setFileName(null);
      onSelect(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--text-main)]">
        {field.name} {field.required && <span className="text-[var(--danger)]">*</span>}
      </label>

      <div className="relative flex items-center justify-between rounded-xl border border-dashed border-[var(--primary-light)] bg-white px-4 py-3 shadow-sm transition-all hover:border-[var(--primary)] hover:bg-[var(--bg-hover)]">
        
        {/* Hidden Input, stretches over the whole box */}
        <input
          type="file"
          accept=".pdf,image/*,.doc,.docx"
          onChange={handleFileChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          title="Click to upload a file"
        />

        <div className="flex items-center gap-3 truncate">
          <div className={`rounded-lg p-2 ${fileName ? 'bg-green-100 text-green-600' : 'bg-[var(--primary-soft)] text-[var(--primary)]'}`}>
            {fileName ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
          </div>
          <span className={`truncate text-sm font-medium ${fileName ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
            {fileName ? fileName : "Click to select a file..."}
          </span>
        </div>

        {/* Clear Button */}
        {fileName && (
          <button
            type="button"
            className="z-20 ml-2 rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            onClick={(e) => {
              e.preventDefault(); // Stop the click from triggering the file input
              setFileName(null);
              onSelect(null);
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}