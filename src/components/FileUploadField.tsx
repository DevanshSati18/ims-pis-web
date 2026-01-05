"use client";

import { SubDepartmentField } from "@/types/Schema";

interface Props {
  field: SubDepartmentField;
  onSelect: (file: File) => void;
}

export default function FileUploadField({
  field,
  onSelect,
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium">
        {field.label}
        {field.required && " *"}
      </label>

      <input
        type="file"
        accept=".pdf,image/*"
        className="mt-1"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onSelect(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
