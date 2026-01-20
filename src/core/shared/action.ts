import { z } from "zod";
import type { ActionResult } from "./action-result";
import { success, failure } from "./action-result";

/**
 * Handler function type for Server Actions
 */
type ActionHandler<TInput, TOutput> = (input: TInput) => Promise<TOutput> | TOutput;

/**
 * Wrap a Server Action handler with Zod validation and error handling
 *
 * @param schema - Zod schema for input validation
 * @param handler - Async handler function that processes validated input
 * @returns A Server Action function that returns ActionResult
 *
 * @example
 * ```typescript
 * const echoSchema = z.object({ message: z.string() });
 * export const echoAction = wrapAction(echoSchema, async (input) => {
 *   return { echoed: input.message };
 * });
 * ```
 */
export function wrapAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: ActionHandler<TInput, TOutput>
): (input: unknown) => Promise<ActionResult<TOutput>> {
  return async (input: unknown): Promise<ActionResult<TOutput>> => {
    try {
      // Validate input with Zod
      const validationResult = schema.safeParse(input);

      if (!validationResult.success) {
        // Extract field errors from Zod
        const fieldErrors: Record<string, string> = {};
        
        validationResult.error.errors.forEach((error) => {
          const path = error.path.join(".");
          if (path) {
            fieldErrors[path] = error.message;
          }
        });

        // Get the main error message
        const mainMessage =
          validationResult.error.errors[0]?.message ||
          "Validation failed";

        return failure(mainMessage, fieldErrors);
      }

      // Execute handler with validated input
      const result = await handler(validationResult.data);

      return success(result);
    } catch (error) {
      // Handle unexpected errors safely
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";

      return failure(errorMessage);
    }
  };
}
