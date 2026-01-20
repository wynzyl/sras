/**
 * Date utilities for Asia/Manila timezone
 */

const MANILA_TIMEZONE = "Asia/Manila";

/**
 * Format a date to a readable string in Manila timezone
 * Example: "January 20, 2024"
 */
export function formatDateManila(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: MANILA_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Format a date with time in Manila timezone
 * Example: "January 20, 2024, 3:45 PM"
 */
export function formatDateTimeManila(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: MANILA_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
}

/**
 * Format a date to short format in Manila timezone
 * Example: "01/20/2024"
 */
export function formatDateShortManila(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: MANILA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
}

/**
 * Format a date to ISO-like format but in Manila timezone
 * Example: "2024-01-20"
 */
export function formatDateISOManila(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: MANILA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(dateObj);
}

/**
 * Format time only in Manila timezone
 * Example: "3:45 PM"
 */
export function formatTimeManila(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: MANILA_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
}

/**
 * Get current date/time in Manila timezone
 */
export function nowManila(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: MANILA_TIMEZONE }));
}

/**
 * Convert a date to Manila timezone Date object
 */
export function toManilaDate(date: Date | string | number): Date {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;

  // Get the date string in Manila timezone
  const manilaString = dateObj.toLocaleString("en-US", { timeZone: MANILA_TIMEZONE });
  return new Date(manilaString);
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTimeManila(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;

  const now = nowManila();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (Math.abs(diffSeconds) < 60) {
    return diffSeconds < 0 ? "just now" : "in a moment";
  }

  if (Math.abs(diffMinutes) < 60) {
    const minutes = Math.abs(diffMinutes);
    return diffMinutes < 0 
      ? `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
      : `in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  if (Math.abs(diffHours) < 24) {
    const hours = Math.abs(diffHours);
    return diffHours < 0 
      ? `${hours} hour${hours !== 1 ? "s" : ""} ago`
      : `in ${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  const days = Math.abs(diffDays);
  return diffDays < 0 
    ? `${days} day${days !== 1 ? "s" : ""} ago`
    : `in ${days} day${days !== 1 ? "s" : ""}`;
}
