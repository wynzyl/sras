import { z } from "zod";
import { dateSchema, phoneSchema } from "@/core/shared/validators";

/**
 * Students domain validators
 */

/**
 * Sex enum schema
 */
export const sexSchema = z.enum(["MALE", "FEMALE"]);

/**
 * EnrollmentStatus enum schema
 */
export const enrollmentStatusSchema = z.enum([
  "ENROLLED",
  "RESERVED",
  "CANCELLED",
  "TRANSFERRED",
]);

/**
 * Student create input schema
 */
export const studentCreateInputSchema = z.object({
  studentNo: z.string().min(1, "Student number is required"),
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional().nullable(),
  sex: sexSchema.optional().nullable(),
  birthDate: dateSchema.optional().nullable(),
  address: z.string().optional().nullable(),
  guardianName: z.string().optional().nullable(),
  guardianPhone: phoneSchema.optional().nullable(),
  isActive: z.boolean().default(true),
});

export type StudentCreateInput = z.infer<typeof studentCreateInputSchema>;

/**
 * Enrollment create input schema
 */
export const enrollmentCreateInputSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  schoolYearId: z.string().min(1, "School year ID is required"),
  gradeLevelId: z.string().min(1, "Grade level ID is required"),
  sectionName: z.string().optional().nullable(),
  status: enrollmentStatusSchema.default("ENROLLED"),
  enrolledAt: dateSchema.optional(),
});

export type EnrollmentCreateInput = z.infer<typeof enrollmentCreateInputSchema>;
