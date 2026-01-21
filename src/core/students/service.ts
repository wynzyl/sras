import "server-only";
import { prisma } from "@/db/prisma";
import type { StudentCreateInput, EnrollmentCreateInput } from "./validators";

/**
 * Students domain services
 * Business logic layer for students operations
 */

/**
 * Create a new student
 */
export async function createStudent(input: StudentCreateInput) {
  return prisma.student.create({
    data: input,
  });
}

/**
 * Create a new enrollment
 */
export async function createEnrollment(input: EnrollmentCreateInput) {
  return prisma.enrollment.create({
    data: {
      ...input,
      status: input.status ?? "ENROLLED",
      enrolledAt: input.enrolledAt ?? new Date(),
    },
    include: {
      student: true,
      schoolYear: true,
      gradeLevel: true,
    },
  });
}
