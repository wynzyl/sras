"use server";

import { revalidatePath } from "next/cache";
import { wrapAction } from "@/core/shared/action";
import {
  feeScheduleInputSchema,
  feeScheduleLineInputSchema,
} from "@/core/accounting/validators";
import {
  createFeeSchedule,
  addFeeScheduleLine,
  deleteFeeScheduleLine,
} from "@/core/accounting/service";

/**
 * Create fee schedule Server Action
 */
export const createFeeScheduleAction = wrapAction(
  feeScheduleInputSchema,
  async (input) => {
    const feeSchedule = await createFeeSchedule(input);
    revalidatePath("/admin/fee-schedules");
    return feeSchedule;
  }
);

/**
 * Add fee schedule line Server Action
 */
export const addFeeScheduleLineAction = wrapAction(
  feeScheduleLineInputSchema,
  async (input) => {
    const line = await addFeeScheduleLine(input);
    revalidatePath(`/admin/fee-schedules/${input.feeScheduleId}`);
    revalidatePath("/admin/fee-schedules");
    return line;
  }
);

/**
 * Delete fee schedule line Server Action
 */
export async function deleteFeeScheduleLineAction(lineId: string, feeScheduleId: string) {
  await deleteFeeScheduleLine(lineId);
  revalidatePath(`/admin/fee-schedules/${feeScheduleId}`);
  revalidatePath("/admin/fee-schedules");
}
