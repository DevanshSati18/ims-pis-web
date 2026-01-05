
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "file";

export interface SubDepartmentField {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
}

export interface SubDepartment {
  key: string;
  name: string;
  departmentKey: string;
  fields: SubDepartmentField[];
}
