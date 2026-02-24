"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { RecordItem } from "@/types/record";
import { SubDepartment } from "@/types/schema";
import { updateRecord, deleteRecord } from "@/store/recordSlice"; 

interface Props {
  records: RecordItem[];
  subDepartment: SubDepartment;
  canEdit: boolean;
}

export default function RecordList({ records, subDepartment, canEdit }: Props) {
  const dispatch = useAppDispatch();

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-main)] bg-[var(--bg-subtle)] p-8 text-center text-[var(--text-muted)]">
        <p className="text-sm">No records found for this section.</p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedIds(newSet);
  };

  const startEditing = (record: RecordItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit) return; 
    setEditingId(record._id);
    setEditTitle(record.title);
    setEditData(record.data || {});
    
    const newSet = new Set(expandedIds);
    newSet.add(record._id);
    setExpandedIds(newSet);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditData({});
  };

  const handleSave = async (recordId: string) => {
    setIsSaving(true);
    try {
      await dispatch(
        updateRecord({
          recordId,
          title: editTitle,
          data: editData,
        })
      ).unwrap();
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update record:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    const confirm = window.confirm("Are you sure you want to permanently delete this record?");
    if (!confirm) return;
    try {
      await dispatch(deleteRecord(recordId)).unwrap();
    } catch (error) {
      alert("Failed to delete record.");
    }
  };

  const formatKeyName = (key: string) => {
    const schemaField = subDepartment?.fields?.find((f) => f.key === key);
    if (schemaField) return schemaField.name;
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  };

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5050';
  };

  return (
    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
      {records.map((record) => {
        const isExpanded = expandedIds.has(record._id);
        const isEditing = editingId === record._id;

        return (
          <div
            key={record._id}
            className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
              isEditing 
                ? 'border-[var(--primary-light)] bg-white ring-4 ring-[var(--primary-soft)]' 
                : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-[var(--primary-light)]'
            }`}
          >
            <div
              className={`flex cursor-pointer items-center justify-between p-4 sm:p-5 ${
                isExpanded && !isEditing ? 'border-b border-[var(--border-main)] bg-[var(--bg-subtle)]' : ''
              }`}
              onClick={() => !isEditing && toggleExpand(record._id)}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${isEditing ? 'bg-[var(--primary)] text-white' : 'bg-[var(--primary-soft)] text-[var(--primary)]'}`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                {isEditing ? (
                  <input
                    className="w-full rounded-lg border border-[var(--primary-light)] bg-white px-3 py-1.5 text-lg font-bold outline-none focus:ring-2 focus:ring-[var(--primary-soft)] sm:w-80"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[var(--text-main)]">
                      {record.title}
                    </h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                      <span>{Object.keys(record.data || {}).length} Fields</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Updated: {(record as unknown).updatedAt ? formatDate((record as unknown).updatedAt) : "Recently"}</span>
                    </div>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="flex items-center gap-3">
                  {canEdit && (
                    <button
                      onClick={(e) => startEditing(record, e)}
                      className="hidden rounded-lg bg-[var(--bg-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] sm:block"
                    >
                      Edit
                    </button>
                  )}
                  <svg
                    className={`h-5 w-5 text-[var(--text-light)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>

            {(isExpanded || isEditing) && (
              <div className="p-4 sm:p-5 animate-in slide-in-from-top-2 duration-300">
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {Object.entries(record.data || {}).map(([key, value]) => {
                    const schemaField = subDepartment?.fields?.find((f) => f.key === key);
                    const isFieldEditable = isEditing && schemaField?.editable;

                    return (
                      <div key={key} className={`flex flex-col gap-1 rounded-xl p-3 ${isEditing && !isFieldEditable ? 'bg-[var(--bg-subtle)] opacity-70' : 'bg-[var(--bg-subtle)]'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                            {formatKeyName(key)}
                          </span>
                        </div>

                        {isFieldEditable ? (
                           <input
                              className="w-full rounded-md border border-[var(--border-main)] px-3 py-1.5 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                              value={(editData[key] as string | number) || ""}
                              type={schemaField?.type === "number" ? "number" : schemaField?.type === "date" ? "date" : "text"}
                              onChange={(e) => setEditData((prev) => ({ 
                                ...prev, 
                                [key]: schemaField?.type === "number" ? Number(e.target.value) : e.target.value 
                              }))}
                            />
                        ) : (
                          <div className="text-sm font-medium text-[var(--text-main)]">
                            {typeof value === 'boolean' ? (value ? "Yes" : "No") : String(value || "—")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!isEditing && record.documents?.length > 0 && (
                  <div className="mt-6 border-t border-[var(--border-main)] pt-5">
                    <h4 className="mb-3 text-sm font-semibold text-[var(--text-main)]">Attached Documents</h4>
                    <div className="flex flex-wrap gap-3">
                      {record.documents.map((doc: unknown) => (
                        <a
                          key={doc.fileName}
                          href={`${getBackendUrl()}/uploads/${doc.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg border border-[var(--border-main)] bg-white px-3 py-2 text-sm font-medium text-[var(--text-main)] shadow-sm transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        >
                          <svg className="h-4 w-4 text-[var(--primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="truncate max-w-[200px]">{doc.originalName}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 👈 RESTORED: Mobile Edit & Desktop Delete Buttons properly formatted */}
                {!isEditing && canEdit && (
                   <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--border-main)] pt-4 sm:flex-row sm:justify-end">
                     <button
                        onClick={() => handleDelete(record._id)}
                        className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 sm:w-auto"
                      >
                        Delete Record
                      </button>

                      {/* Visible ONLY on mobile, triggers the exact same edit state */}
                      <button
                        onClick={(e) => startEditing(record, e)}
                        className="w-full rounded-lg border border-[var(--primary-light)] bg-[var(--primary-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-white sm:hidden"
                      >
                        Edit Record
                      </button>
                   </div>
                )}

                {isEditing && (
                  <div className="mt-6 flex items-center justify-end gap-3 border-t border-[var(--border-main)] pt-5">
                    <button onClick={cancelEditing} disabled={isSaving} className="rounded-xl border border-[var(--border-main)] bg-white px-5 py-2 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-gray-50 hover:text-[var(--text-main)]">
                      Cancel
                    </button>
                    <button onClick={() => handleSave(record._id)} disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[var(--secondary)] disabled:opacity-70">
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}