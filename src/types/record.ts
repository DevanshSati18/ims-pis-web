export interface RecordDocument {
  fieldKey: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface RecordItem {
  _id: string;
  departmentKey: string;
  subDepartmentKey: string;
  title: string;
  data: Record<string, string | number | boolean>;
  documents: RecordDocument[];
  createdAt: string;
  updatedAt: string;
}
