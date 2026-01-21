"use server";

import { revalidatePath } from "next/cache";
import { wrapAction } from "@/core/shared/action";
import { feeItemInputSchema } from "@/core/accounting/validators";
import { createFeeItem } from "@/core/accounting/service";

/**
 * Create fee item Server Action
 */
export const createFeeItemAction = wrapAction(
  feeItemInputSchema,
  async (input) => {
    const feeItem = await createFeeItem(input);
    revalidatePath("/admin/fee-items");
    return feeItem;
  }
);
