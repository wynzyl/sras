import { z } from "zod";
import { dateSchema } from "@/core/shared/validators";

/**
 * Academic domain validators
 */

/**
 * SchoolYear input schema
 */
export const schoolYearInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: dateSchema,
  endDate: dateSchema,
  isActive: z.boolean().default(true),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type SchoolYearInput = z.infer<typeof schoolYearInputSchema>;

/**
 * GradeLevel input schema
 */
export const gradeLevelInputSchema = z.object({
  code: z.string().min(1, "Code is required").max(20, "Code must be at most 20 characters"),
  name: z.string().min(1, "Name is required"),
  sortOrder: z.number().int("Sort order must be an integer"),
});

export type GradeLevelInput = z.infer<typeof gradeLevelInputSchema>;

/**
 * CurriculumVersion input schema
 */
export const curriculumVersionInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  effectiveDate: dateSchema,
  isActive: z.boolean().default(true),
});

export type CurriculumVersionInput = z.infer<typeof curriculumVersionInputSchema>;

/**
 * Subject input schema
 */
export const subjectInputSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  units: z.number().int().positive("Units must be a positive integer").optional().nullable(),
  gradeLevelId: z.string().min(1, "Grade level ID is required"),
  curriculumVersionId: z.string().min(1, "Curriculum version ID is required"),
  schoolYearId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type SubjectInput = z.infer<typeof subjectInputSchema>;
