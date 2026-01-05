"use client";

import { SubDepartmentField } from "@/types/Schema";

interface Props {
  fields: SubDepartmentField[];
  value: Record<string, string | number | boolean>;
  onChange: (key: string, value: string | number | boolean) => void;
}

export default function DynamicForm({
  fields,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      {fields
        .filter((f) => f.type !== "file")
        .map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && " *"}
            </label>

            <input
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "date"
                  ? "date"
                  : "text"
              }
              className="mt-1 w-full border p-2"
              value={value[field.key]?.toString() ?? ""}
              onChange={(e) =>
                onChange(
                  field.key,
                  field.type === "number"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
            />
          </div>
        ))}
    </div>
  );
}
