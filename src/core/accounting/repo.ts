import "server-only";
import { prisma } from "@/db/prisma";

/**
 * Accounting domain repository
 * Data access functions for accounting entities
 */

/**
 * List all accounts, ordered by code
 */
export async function listAccounts() {
  return prisma.account.findMany({
    orderBy: { code: "asc" },
  });
}

/**
 * Get account by code
 */
export async function getAccountByCode(code: string) {
  return prisma.account.findUnique({
    where: { code },
  });
}

/**
 * List all fee items, ordered by code
 */
export async function listFeeItems() {
  return prisma.feeItem.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" },
  });
}

/**
 * List fee schedules with optional filters
 */
export async function listFeeSchedules(filters?: {
  schoolYearId?: string;
  gradeLevelId?: string;
  isActive?: boolean;
}) {
  return prisma.feeSchedule.findMany({
    where: {
      ...(filters?.schoolYearId && { schoolYearId: filters.schoolYearId }),
      ...(filters?.gradeLevelId && { gradeLevelId: filters.gradeLevelId }),
      ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
    },
    include: {
      schoolYear: true,
      gradeLevel: true,
    },
    orderBy: [
      { schoolYear: { startDate: "desc" } },
      { gradeLevel: { sortOrder: "asc" } },
      { name: "asc" },
    ],
  });
}

/**
 * Get fee schedule with its lines (fee items)
 */
export async function getFeeScheduleWithLines(feeScheduleId: string) {
  return prisma.feeSchedule.findUnique({
    where: { id: feeScheduleId },
    include: {
      schoolYear: true,
      gradeLevel: true,
      lines: {
        include: {
          feeItem: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}
