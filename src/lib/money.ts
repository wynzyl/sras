/**
 * Money utilities for handling currency in cents (integer only, no floats)
 */

/**
 * Parse a money string or number to integer cents
 * Handles strings like "1000.50" or "1,000.50" -> 100050 cents
 * Handles numbers like 1000.50 -> 100050 cents
 * Always returns integer (rounds if needed)
 */
export function parseMoneyToCents(value: string | number): number {
  if (typeof value === "number") {
    // Round to nearest cent and convert to integer
    return Math.round(value * 100);
  }

  // Remove currency symbols, spaces, and commas
  const cleaned = value
    .replace(/[₱$€£¥,\s]/g, "")
    .trim();

  // Parse as float then convert to cents
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) {
    throw new Error(`Invalid money value: ${value}`);
  }

  // Round to nearest cent and convert to integer
  return Math.round(parsed * 100);
}

/**
 * Format integer cents to PHP currency string
 * Example: 100050 -> "₱1,000.50"
 */
export function formatCentsToPHP(cents: number): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`Cents must be an integer, got: ${cents}`);
  }

  // Convert cents to pesos (divide by 100)
  const pesos = cents / 100;

  // Format with 2 decimal places and thousand separators
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pesos);
}

/**
 * Format integer cents to PHP currency string without symbol
 * Example: 100050 -> "1,000.50"
 */
export function formatCentsToPHPString(cents: number): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`Cents must be an integer, got: ${cents}`);
  }

  const pesos = cents / 100;

  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pesos);
}

/**
 * Convert pesos (number) to integer cents
 * Example: 1000.50 -> 100050
 */
export function pesosToCents(pesos: number): number {
  return Math.round(pesos * 100);
}

/**
 * Convert integer cents to pesos (number)
 * Example: 100050 -> 1000.50
 */
export function centsToPesos(cents: number): number {
  if (!Number.isInteger(cents)) {
    throw new Error(`Cents must be an integer, got: ${cents}`);
  }
  return cents / 100;
}

/**
 * Safe addition of cents (prevents overflow)
 */
export function addCents(a: number, b: number): number {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new Error("Both values must be integers");
  }
  const result = a + b;
  if (!Number.isSafeInteger(result)) {
    throw new Error(`Addition result exceeds safe integer: ${result}`);
  }
  return result;
}

/**
 * Safe subtraction of cents (prevents underflow)
 */
export function subtractCents(a: number, b: number): number {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new Error("Both values must be integers");
  }
  const result = a - b;
  if (!Number.isSafeInteger(result)) {
    throw new Error(`Subtraction result exceeds safe integer: ${result}`);
  }
  return result;
}

/**
 * Safe multiplication of cents (prevents overflow)
 */
export function multiplyCents(cents: number, multiplier: number): number {
  if (!Number.isInteger(cents)) {
    throw new Error("Cents must be an integer");
  }
  const result = Math.round(cents * multiplier);
  if (!Number.isSafeInteger(result)) {
    throw new Error(`Multiplication result exceeds safe integer: ${result}`);
  }
  return result;
}

/**
 * Check if a number is a safe integer (within JavaScript's safe integer range)
 */
export function isSafeIntegerCents(value: number): boolean {
  return Number.isInteger(value) && Number.isSafeInteger(value);
}
