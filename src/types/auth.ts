export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;
name : string;
mobile : number;
  // ACL: dept:subDept tokens
  visibleSubDepartments?: string[];
}
