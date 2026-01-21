"use server";

import { revalidatePath } from "next/cache";
import { wrapAction } from "@/core/shared/action";
import { studentCreateInputSchema } from "@/core/students/validators";
import { createStudent } from "@/core/students/service";
import { searchStudents } from "@/core/students/repo";

/**
 * Create student Server Action
 */
export const createStudentAction = wrapAction(
  studentCreateInputSchema,
  async (input) => {
    const student = await createStudent(input);
    revalidatePath("/students");
    return student;
  }
);

/**
 * Search students Server Action
 */
export async function searchStudentsAction(query: string) {
  if (!query || query.trim().length === 0) {
    // Return empty array if no query
    return [];
  }
  return searchStudents(query.trim());
}
