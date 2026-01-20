import { Role, ROLE_HIERARCHY, hasHigherOrEqualHierarchy } from "./roles";

/**
 * Permission definitions for different actions
 */
export enum Permission {
  // Student management
  VIEW_STUDENTS = "VIEW_STUDENTS",
  CREATE_STUDENTS = "CREATE_STUDENTS",
  UPDATE_STUDENTS = "UPDATE_STUDENTS",
  DELETE_STUDENTS = "DELETE_STUDENTS",

  // Enrollment
  VIEW_ENROLLMENTS = "VIEW_ENROLLMENTS",
  CREATE_ENROLLMENTS = "CREATE_ENROLLMENTS",
  UPDATE_ENROLLMENTS = "UPDATE_ENROLLMENTS",
  DELETE_ENROLLMENTS = "DELETE_ENROLLMENTS",

  // Academic
  VIEW_COURSES = "VIEW_COURSES",
  CREATE_COURSES = "CREATE_COURSES",
  UPDATE_COURSES = "UPDATE_COURSES",
  DELETE_COURSES = "DELETE_COURSES",
  VIEW_GRADES = "VIEW_GRADES",
  UPDATE_GRADES = "UPDATE_GRADES",

  // Financial
  VIEW_PAYMENTS = "VIEW_PAYMENTS",
  CREATE_PAYMENTS = "CREATE_PAYMENTS",
  UPDATE_PAYMENTS = "UPDATE_PAYMENTS",
  DELETE_PAYMENTS = "DELETE_PAYMENTS",
  VIEW_FEES = "VIEW_FEES",
  CREATE_FEES = "CREATE_FEES",
  UPDATE_FEES = "UPDATE_FEES",
  DELETE_FEES = "DELETE_FEES",
  VIEW_REPORTS = "VIEW_REPORTS",

  // System
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_ROLES = "MANAGE_ROLES",
  VIEW_AUDIT_LOGS = "VIEW_AUDIT_LOGS",
}

/**
 * Role-based permissions mapping
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // Admin has all permissions
    ...Object.values(Permission),
  ],
  [Role.REGISTRAR]: [
    // Student management
    Permission.VIEW_STUDENTS,
    Permission.CREATE_STUDENTS,
    Permission.UPDATE_STUDENTS,
    Permission.DELETE_STUDENTS,
    // Enrollment
    Permission.VIEW_ENROLLMENTS,
    Permission.CREATE_ENROLLMENTS,
    Permission.UPDATE_ENROLLMENTS,
    Permission.DELETE_ENROLLMENTS,
    // Academic (read-only)
    Permission.VIEW_COURSES,
    Permission.VIEW_GRADES,
    // Financial (read-only)
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_FEES,
  ],
  [Role.ACCOUNTING]: [
    // Student management (read-only)
    Permission.VIEW_STUDENTS,
    // Enrollment (read-only)
    Permission.VIEW_ENROLLMENTS,
    // Academic (read-only)
    Permission.VIEW_COURSES,
    Permission.VIEW_GRADES,
    // Financial (full access)
    Permission.VIEW_PAYMENTS,
    Permission.CREATE_PAYMENTS,
    Permission.UPDATE_PAYMENTS,
    Permission.DELETE_PAYMENTS,
    Permission.VIEW_FEES,
    Permission.CREATE_FEES,
    Permission.UPDATE_FEES,
    Permission.DELETE_FEES,
    Permission.VIEW_REPORTS,
  ],
  [Role.CASHIER]: [
    // Student management (read-only)
    Permission.VIEW_STUDENTS,
    // Enrollment (read-only)
    Permission.VIEW_ENROLLMENTS,
    // Academic (read-only)
    Permission.VIEW_COURSES,
    // Financial (limited - payments only)
    Permission.VIEW_PAYMENTS,
    Permission.CREATE_PAYMENTS,
    Permission.VIEW_FEES,
  ],
  [Role.TEACHER]: [
    // Student management (read-only)
    Permission.VIEW_STUDENTS,
    // Enrollment (read-only)
    Permission.VIEW_ENROLLMENTS,
    // Academic (full access for their courses)
    Permission.VIEW_COURSES,
    Permission.VIEW_GRADES,
    Permission.UPDATE_GRADES,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Check if a user role can access a resource owned by another role
 * Uses hierarchy: higher hierarchy roles can access lower hierarchy resources
 */
export function canAccessResource(
  userRole: Role,
  resourceOwnerRole: Role
): boolean {
  return hasHigherOrEqualHierarchy(userRole, resourceOwnerRole);
}

/**
 * Guard function that throws if user doesn't have permission
 */
export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Role ${role} does not have permission ${permission}`
    );
  }
}

/**
 * Guard function that throws if user doesn't have any of the permissions
 */
export function requireAnyPermission(
  role: Role,
  permissions: Permission[]
): void {
  if (!hasAnyPermission(role, permissions)) {
    throw new Error(
      `Role ${role} does not have any of the required permissions: ${permissions.join(", ")}`
    );
  }
}

/**
 * Guard function that throws if user doesn't have all permissions
 */
export function requireAllPermissions(
  role: Role,
  permissions: Permission[]
): void {
  if (!hasAllPermissions(role, permissions)) {
    throw new Error(
      `Role ${role} does not have all required permissions: ${permissions.join(", ")}`
    );
  }
}
