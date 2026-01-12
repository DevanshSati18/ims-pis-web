"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  createRecord,
  uploadRecordFile,
} from "@/store/recordSlice";
import DynamicForm from "./DynamicForm";
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
  const [data, setData] = useState<
    Record<string, string | number | boolean>
  >({});
  const [files, setFiles] = useState<Record<string, File>>(
    {}
  );

  const handleSubmit = async () => {
    const record = await dispatch(
      createRecord({
        departmentKey,
        subDepartmentKey: subDepartment.key,
        title,
        data,
      })
    ).unwrap();

    for (const fieldKey of Object.keys(files)) {
      await dispatch(
        uploadRecordFile({
          recordId: record._id,
          fieldKey,
          file: files[fieldKey],
        })
      );
    }

    alert("Record created successfully");
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Record Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <DynamicForm
        fields={subDepartment.fields}
        value={data}
        onChange={(k, v) =>
          setData((prev) => ({ ...prev, [k]: v }))
        }
      />

      {subDepartment.fields
        .filter((f) => f.type === "file")
        .map((field) => (
          <FileUploadField
            key={field.key}
            field={field}
            onSelect={(file) =>
              setFiles((prev) => ({
                ...prev,
                [field.key]: file,
              }))
            }
          />
        ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 px-4 py-2 text-white"
      >
        Create Record
      </button>
    </div>
  );
}
