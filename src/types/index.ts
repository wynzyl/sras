/**
 * Shared TypeScript types and interfaces
 *
 * This file exports common types used across multiple domains.
 * Domain-specific types should live in their respective /core/* directories.
 */

// Example: Common types
export type Status = "active" | "inactive" | "pending";

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
