"use server";

import { revalidatePath } from "next/cache";
import { wrapAction } from "@/core/shared/action";
import { subjectInputSchema } from "@/core/academic/validators";
import { createSubject } from "@/core/academic/service";
import { listSubjects } from "@/core/academic/repo";

/**
 * Create subject Server Action
 */
export const createSubjectAction = wrapAction(
  subjectInputSchema,
  async (input) => {
    const subject = await createSubject(input);
    revalidatePath("/admin/subjects");
    return subject;
  }
);

/**
 * List subjects Server Action
 */
export async function listSubjectsAction(filters: {
  gradeLevelId: string;
  curriculumVersionId: string;
}) {
  return listSubjects(filters);
}
