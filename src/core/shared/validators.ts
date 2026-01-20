import { z } from "zod";
import { parseMoneyToCents, isSafeIntegerCents } from "@/lib/money";

/**
 * Common field validators using Zod
 */

/**
 * ID validator - accepts UUID, numeric ID, or string ID
 */
export const idSchema = z.union([
  z.string().uuid("Invalid UUID format"),
  z.string().min(1, "ID cannot be empty"),
  z.number().int().positive("ID must be a positive integer"),
]);

/**
 * UUID validator - strict UUID format
 */
export const uuidSchema = z.string().uuid("Invalid UUID format");

/**
 * Numeric ID validator
 */
export const numericIdSchema = z.number().int().positive("ID must be a positive integer");

/**
 * Date validator - accepts Date object, ISO string, or timestamp
 */
export const dateSchema = z.union([
  z.date(),
  z.string().datetime({ message: "Invalid date format" }),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  z.number().int().positive("Invalid timestamp"),
]).transform((val) => {
  if (val instanceof Date) return val;
  if (typeof val === "number") return new Date(val);
  return new Date(val);
});

/**
 * Date string validator (YYYY-MM-DD format)
 */
export const dateStringSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  "Date must be in YYYY-MM-DD format"
);

/**
 * Money validator - accepts string or number, converts to integer cents
 * Example: "1000.50" or 1000.50 -> 100050 (cents)
 */
export const moneySchema = z.union([
  z.string(),
  z.number(),
]).transform((val) => {
  try {
    const cents = parseMoneyToCents(val);
    if (!isSafeIntegerCents(cents)) {
      throw new Error("Money value exceeds safe integer range");
    }
    return cents;
  } catch (error) {
    throw new z.ZodError([
      {
        code: "custom",
        message: error instanceof Error ? error.message : "Invalid money value",
        path: [],
      },
    ]);
  }
});

/**
 * Cents validator - validates integer cents directly
 */
export const centsSchema = z.number().int().refine(
  (val) => isSafeIntegerCents(val),
  { message: "Cents must be a safe integer" }
);

/**
 * Code validator - alphanumeric code (e.g., student code, course code)
 * Default: 3-20 characters, alphanumeric and hyphens/underscores
 */
export const codeSchema = z.string()
  .min(3, "Code must be at least 3 characters")
  .max(20, "Code must be at most 20 characters")
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "Code can only contain letters, numbers, hyphens, and underscores"
  )
  .transform((val) => val.toUpperCase());

/**
 * Email validator
 */
export const emailSchema = z.string().email("Invalid email format");

/**
 * Phone number validator (Philippines format)
 */
export const phoneSchema = z.string().regex(
  /^(\+63|0)?[9]\d{9}$/,
  "Invalid Philippine phone number format"
);

/**
 * Pagination params validator
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

/**
 * Sort order validator
 */
export const sortOrderSchema = z.enum(["asc", "desc"]).default("asc");

/**
 * Optional string validator (empty string becomes undefined)
 */
export const optionalStringSchema = z.string().optional().or(z.literal("").transform(() => undefined));

/**
 * Non-empty string validator
 */
export const nonEmptyStringSchema = z.string().min(1, "String cannot be empty");

/**
 * Positive number validator
 */
export const positiveNumberSchema = z.number().positive("Number must be positive");

/**
 * Non-negative number validator (includes zero)
 */
export const nonNegativeNumberSchema = z.number().nonnegative("Number must be non-negative");
