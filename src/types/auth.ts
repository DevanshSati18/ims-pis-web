export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;

  // ACL: dept:subDept tokens
  visibleSubDepartments?: string[];
}
