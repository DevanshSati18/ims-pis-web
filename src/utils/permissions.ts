export const hasReadAccess = (
  permissions: string[],
  deptKey: string,
  subKey: string
) => {
  return permissions.some(
    (p) =>
      p === `${deptKey}:${subKey}:read` ||
      p === `${deptKey}:${subKey}:write`
  );
};

export const hasWriteAccess = (
  permissions: string[],
  deptKey: string,
  subKey: string
) => {
  return permissions.includes(
    `${deptKey}:${subKey}:write`
  );
};
