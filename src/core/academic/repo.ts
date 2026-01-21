import "server-only";
import { prisma } from "@/db/prisma";

/**
 * Academic domain repository
 * Data access functions for academic entities
 */

/**
 * List all school years, ordered by start date (newest first)
 */
export async function listSchoolYears() {
  return prisma.schoolYear.findMany({
    orderBy: { startDate: "desc" },
  });
}

/**
 * Get the currently active school year
 */
export async function getActiveSchoolYear() {
  return prisma.schoolYear.findFirst({
    where: { isActive: true },
    orderBy: { startDate: "desc" },
  });
}

/**
 * List all grade levels, ordered by sortOrder
 */
export async function listGradeLevels() {
  return prisma.gradeLevel.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * List all curriculum versions, ordered by effective date (newest first)
 */
export async function listCurriculumVersions() {
  return prisma.curriculumVersion.findMany({
    orderBy: { effectiveDate: "desc" },
  });
}

/**
 * List subjects filtered by grade level
 */
export async function listSubjectsByGrade(gradeLevelId: string) {
  return prisma.subject.findMany({
    where: {
      gradeLevelId,
      isActive: true,
    },
    include: {
      gradeLevel: true,
      curriculumVersion: true,
      schoolYear: true,
    },
    orderBy: { code: "asc" },
  });
}

/**
 * List subjects filtered by grade level and curriculum version
 */
export async function listSubjects(
  filters: {
    gradeLevelId: string;
    curriculumVersionId: string;
  }
) {
  return prisma.subject.findMany({
    where: {
      gradeLevelId: filters.gradeLevelId,
      curriculumVersionId: filters.curriculumVersionId,
    },
    include: {
      gradeLevel: true,
      curriculumVersion: true,
      schoolYear: true,
    },
    orderBy: { code: "asc" },
  });
}
