import type { UserInfoDto } from "../api/generated/model";
import { Roles } from "../enums/Roles";

const normalize = (value: string): string => value.trim().toLowerCase();

const normalizeList = (values?: string[] | null): string[] => {
  if (!values) {
    return [];
  }

  return values.map(normalize).filter(Boolean);
};

export const hasRole = (user: UserInfoDto | null | undefined, role: string): boolean => {
  const expectedRole = normalize(role);
  return normalizeList(user?.roles).includes(expectedRole);
};

export const hasPermissionClaim = (
  user: UserInfoDto | null | undefined,
  claim: string,
): boolean => {
  const expectedClaim = normalize(claim);
  return normalizeList(user?.permissionClaims).includes(expectedClaim);
};

export const isAdminUser = (user: UserInfoDto | null | undefined): boolean => {
  return hasRole(user, Roles.Admin) || hasPermissionClaim(user, "admin.access");
};
