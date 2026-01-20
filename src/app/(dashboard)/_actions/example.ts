"use server";

import { z } from "zod";
import { wrapAction } from "@/core/shared/action";
import type { ActionResult } from "@/core/shared/action-result";

/**
 * Example schema for echo action
 */
const echoSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  repeat: z.number().int().positive().optional().default(1),
});

/**
 * Example Server Action that echoes back the input
 * Demonstrates the standard Server Action pattern
 */
export const echoAction = wrapAction(
  echoSchema,
  async (input): Promise<{ echoed: string; repeated: number }> => {
    // Simulate some async work
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Echo back the message
    const echoed = input.message;
    const repeated = input.repeat ?? 1;

    return {
      echoed,
      repeated,
    };
  }
);

/**
 * Type helper for the echo action result
 */
export type EchoActionResult = ActionResult<{
  echoed: string;
  repeated: number;
}>;
