"use server";

import { revalidatePath } from "next/cache";
import { wrapAction } from "@/core/shared/action";
import { curriculumVersionInputSchema } from "@/core/academic/validators";
import { createCurriculumVersion } from "@/core/academic/service";

/**
 * Create curriculum version Server Action
 */
export const createCurriculumVersionAction = wrapAction(
  curriculumVersionInputSchema,
  async (input) => {
    const curriculumVersion = await createCurriculumVersion(input);
    revalidatePath("/admin/curriculum-versions");
    return curriculumVersion;
  }
);
