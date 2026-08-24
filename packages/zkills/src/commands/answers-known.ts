import type { LockEntry } from "../core/schema/lock.ts";
import type { Answers } from "../core/types.ts";
import { secretsFor } from "../io/local.ts";
import type { Ctx } from "./context.ts";

// Public answers from lock plus secrets from local file
export function knownAnswers(ctx: Ctx, name: string, entry: LockEntry): Answers {
  return { ...entry.answers, ...secretsFor(ctx.local, name) };
}
