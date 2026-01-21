import "server-only";
import { prisma } from "@/db/prisma";
import type { Student, Enrollment, EnrollmentStatus, Sex } from "@prisma/client";

/**
 * Students domain repository
 * Data access functions for students and enrollments
 */

/**
 * Search students by query (searches studentNo, lastName, firstName)
 */
export async function searchStudents(query: string) {
  return prisma.student.findMany({
    where: {
      OR: [
        { studentNo: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        { firstName: { contains: query, mode: "insensitive" } },
        { middleName: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

/**
 * Get student by ID
 */
export async function getStudent(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          schoolYear: true,
          gradeLevel: true,
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
  });
}

/**
 * Get enrollment by ID with relations
 */
export async function getEnrollment(id: string) {
  return prisma.enrollment.findUnique({
    where: { id },
    include: {
      student: true,
      schoolYear: true,
      gradeLevel: true,
    },
  });
}

/**
 * Create a new student
 */
export async function createStudent(data: {
  studentNo: string;
  lastName: string;
  firstName: string;
  middleName?: string | null;
  sex?: Sex | null;
  birthDate?: Date | null;
  address?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  isActive?: boolean;
}) {
  return prisma.student.create({
    data,
  });
}

/**
 * List enrollments with optional filters
 */
export async function listEnrollments(filters?: {
  studentId?: string;
  schoolYearId?: string;
  gradeLevelId?: string;
  status?: EnrollmentStatus;
  isActive?: boolean;
}) {
  return prisma.enrollment.findMany({
    where: {
      ...(filters?.studentId && { studentId: filters.studentId }),
      ...(filters?.schoolYearId && { schoolYearId: filters.schoolYearId }),
      ...(filters?.gradeLevelId && { gradeLevelId: filters.gradeLevelId }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.isActive !== undefined && {
        student: { isActive: filters.isActive },
      }),
    },
    include: {
      student: true,
      schoolYear: true,
      gradeLevel: true,
    },
    orderBy: [
      { schoolYear: { startDate: "desc" } },
      { enrolledAt: "desc" },
    ],
  });
}

/**
 * Create a new enrollment
 */
export async function createEnrollment(data: {
  studentId: string;
  schoolYearId: string;
  gradeLevelId: string;
  sectionName?: string | null;
  status?: EnrollmentStatus;
  enrolledAt?: Date;
}) {
  return prisma.enrollment.create({
    data: {
      ...data,
      status: data.status ?? "ENROLLED",
      enrolledAt: data.enrolledAt ?? new Date(),
    },
    include: {
      student: true,
      schoolYear: true,
      gradeLevel: true,
    },
  });
}
