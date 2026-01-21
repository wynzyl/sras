"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { wrapAction } from "@/core/shared/action";
import { enrollmentCreateInputSchema } from "@/core/students/validators";
import { createEnrollment } from "@/core/students/service";
import { searchStudents } from "@/core/students/repo";

/**
 * Create enrollment Server Action
 * Note: redirect() throws NEXT_REDIRECT, so we need to handle it outside wrapAction
 */
export async function createEnrollmentAction(formData: FormData) {
  const input = {
    studentId: formData.get("studentId") as string,
    schoolYearId: formData.get("schoolYearId") as string,
    gradeLevelId: formData.get("gradeLevelId") as string,
    sectionName: (formData.get("sectionName") as string) || null,
    status: "ENROLLED" as const,
  };

  const result = await wrapAction(
    enrollmentCreateInputSchema,
    async (validatedInput) => {
      const enrollment = await createEnrollment(validatedInput);
      revalidatePath("/enrollments");
      revalidatePath(`/students/${validatedInput.studentId}`);
      return enrollment;
    }
  )(input);

  if (result.ok) {
    redirect(`/enrollments/${result.data.id}`);
  }

  return result;
}

/**
 * Search students Server Action (for enrollment form)
 */
export async function searchStudentsForEnrollmentAction(query: string) {
  if (!query || query.trim().length === 0) {
    return [];
  }
  return searchStudents(query.trim());
}
