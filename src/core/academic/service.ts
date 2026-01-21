import "server-only";
import { prisma } from "@/db/prisma";
import type {
  SubjectInput,
  CurriculumVersionInput,
} from "./validators";

/**
 * Academic domain services
 * Business logic layer for academic operations
 */

/**
 * Create a new subject
 */
export async function createSubject(input: SubjectInput) {
  return prisma.subject.create({
    data: input,
  });
}

/**
 * Create a new curriculum version
 */
export async function createCurriculumVersion(input: CurriculumVersionInput) {
  return prisma.curriculumVersion.create({
    data: input,
  });
}
