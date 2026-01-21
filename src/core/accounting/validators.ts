import { z } from "zod";
import { centsSchema, moneySchema } from "@/core/shared/validators";

/**
 * Accounting domain validators
 */

/**
 * Account code validator - uppercase alphanumeric + underscore
 */
const accountCodeSchema = z
  .string()
  .min(1, "Code cannot be empty")
  .max(50, "Code must be at most 50 characters")
  .regex(/^[A-Z0-9_]+$/, "Code can only contain uppercase letters, numbers, and underscores")
  .transform((val) => val.toUpperCase());

/**
 * Fee item code validator - uppercase alphanumeric + underscore
 */
const feeItemCodeSchema = z
  .string()
  .min(1, "Code cannot be empty")
  .max(50, "Code must be at most 50 characters")
  .regex(/^[A-Z0-9_]+$/, "Code can only contain uppercase letters, numbers, and underscores")
  .transform((val) => val.toUpperCase());

/**
 * AccountType enum
 */
export const accountTypeSchema = z.enum([
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "EXPENSE",
  "CONTRA_REVENUE",
]);

/**
 * Account input schema
 */
export const accountInputSchema = z.object({
  code: accountCodeSchema,
  name: z.string().min(1, "Name is required"),
  type: accountTypeSchema,
  isActive: z.boolean().default(true),
});

export type AccountInput = z.infer<typeof accountInputSchema>;

/**
 * FeeItem input schema
 * Accepts money string/number for defaultAmountCents (converts to integer cents)
 */
export const feeItemInputSchema = z.object({
  code: feeItemCodeSchema,
  name: z.string().min(1, "Name is required"),
  defaultAmountCents: z.union([moneySchema, centsSchema]),
  revenueAccountCode: accountCodeSchema,
  isActive: z.boolean().default(true),
});

export type FeeItemInput = z.infer<typeof feeItemInputSchema>;

/**
 * FeeSchedule input schema
 */
export const feeScheduleInputSchema = z.object({
  schoolYearId: z.string().min(1, "School year ID is required"),
  gradeLevelId: z.string().min(1, "Grade level ID is required"),
  name: z.string().min(1, "Name is required"),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type FeeScheduleInput = z.infer<typeof feeScheduleInputSchema>;

/**
 * FeeScheduleLine input schema
 * Accepts money string/number for amountCents (converts to integer cents)
 */
export const feeScheduleLineInputSchema = z.object({
  feeScheduleId: z.string().min(1, "Fee schedule ID is required"),
  feeItemId: z.string().min(1, "Fee item ID is required"),
  amountCents: z.union([moneySchema, centsSchema]),
  isRequired: z.boolean().default(true),
  sortOrder: z.number().int("Sort order must be an integer"),
});

export type FeeScheduleLineInput = z.infer<typeof feeScheduleLineInputSchema>;
