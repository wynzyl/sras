/**
 * User roles in the SRAS system
 */
export enum Role {
  ADMIN = "ADMIN",
  REGISTRAR = "REGISTRAR",
  CASHIER = "CASHIER",
  ACCOUNTING = "ACCOUNTING",
  TEACHER = "TEACHER",
}

/**
 * Role hierarchy - higher number means more permissions
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.ADMIN]: 5,
  [Role.REGISTRAR]: 4,
  [Role.ACCOUNTING]: 3,
  [Role.CASHIER]: 2,
  [Role.TEACHER]: 1,
};

/**
 * Check if a role exists
 */
export function isValidRole(role: string): role is Role {
  return Object.values(Role).includes(role as Role);
}

/**
 * Get all available roles
 */
export function getAllRoles(): Role[] {
  return Object.values(Role);
}

/**
 * Check if role1 has higher or equal hierarchy than role2
 */
export function hasHigherOrEqualHierarchy(role1: Role, role2: Role): boolean {
  return ROLE_HIERARCHY[role1] >= ROLE_HIERARCHY[role2];
}
