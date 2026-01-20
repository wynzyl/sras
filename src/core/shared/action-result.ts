/**
 * Standard result type for Server Actions
 * Represents either a success with data or a failure with error details
 */
export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        message: string;
        fieldErrors?: Record<string, string>;
      };
    };

/**
 * Create a success result
 */
export function success<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

/**
 * Create a failure result with message
 */
export function failure(message: string): ActionResult<never>;
export function failure(
  message: string,
  fieldErrors: Record<string, string>
): ActionResult<never>;
export function failure(
  message: string,
  fieldErrors?: Record<string, string>
): ActionResult<never> {
  return {
    ok: false,
    error: {
      message,
      ...(fieldErrors && { fieldErrors }),
    },
  };
}
