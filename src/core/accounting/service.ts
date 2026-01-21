import "server-only";
import { prisma } from "@/db/prisma";
import type {
  AccountInput,
  FeeItemInput,
  FeeScheduleInput,
  FeeScheduleLineInput,
} from "./validators";
import { getAccountByCode } from "./repo";

/**
 * Accounting domain services
 * Business logic layer for accounting operations
 */

/**
 * Create a new account
 */
export async function createAccount(input: AccountInput) {
  return prisma.account.create({
    data: input,
  });
}

/**
 * Create a new fee item
 * Validates that revenueAccountCode exists in Account table
 */
export async function createFeeItem(input: FeeItemInput) {
  // Validate that the revenue account exists
  const account = await getAccountByCode(input.revenueAccountCode);
  if (!account) {
    throw new Error(
      `Account with code "${input.revenueAccountCode}" does not exist`
    );
  }

  return prisma.feeItem.create({
    data: input,
  });
}

/**
 * Create a new fee schedule
 */
export async function createFeeSchedule(input: FeeScheduleInput) {
  return prisma.feeSchedule.create({
    data: input,
  });
}

/**
 * Add a line to a fee schedule
 * Uses transaction to ensure fee schedule exists and fee item exists
 */
export async function addFeeScheduleLine(input: FeeScheduleLineInput) {
  return prisma.$transaction(async (tx) => {
    // Validate fee schedule exists
    const feeSchedule = await tx.feeSchedule.findUnique({
      where: { id: input.feeScheduleId },
    });
    if (!feeSchedule) {
      throw new Error(`Fee schedule with ID "${input.feeScheduleId}" does not exist`);
    }

    // Validate fee item exists
    const feeItem = await tx.feeItem.findUnique({
      where: { id: input.feeItemId },
    });
    if (!feeItem) {
      throw new Error(`Fee item with ID "${input.feeItemId}" does not exist`);
    }

    // Create the line
    return tx.feeScheduleLine.create({
      data: input,
    });
  });
}

/**
 * Delete a fee schedule line
 */
export async function deleteFeeScheduleLine(lineId: string) {
  return prisma.feeScheduleLine.delete({
    where: { id: lineId },
  });
}
