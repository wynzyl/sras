"use server";

import { revalidatePath } from "next/cache";
import { wrapAction } from "@/core/shared/action";
import { accountInputSchema } from "@/core/accounting/validators";
import { createAccount } from "@/core/accounting/service";

/**
 * Create account Server Action
 */
export const createAccountAction = wrapAction(
  accountInputSchema,
  async (input) => {
    const account = await createAccount(input);
    revalidatePath("/admin/accounts");
    return account;
  }
);
