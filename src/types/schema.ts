
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "file";

export interface SubDepartmentField {
  key: string;
  name: string;
  type: FieldType;
  required: boolean;
 editable : boolean
}

export interface SubDepartment {
  key: string;
  name: string;
  departmentKey: string;
  fields: SubDepartmentField[];
}
