import { z } from "zod";

export const LOCAL_FILE = "zkills.local.json";

// skill name → placeholder name → secret value
export const LocalFile = z.object({
  version: z.literal(1),
  secrets: z.record(z.string(), z.record(z.string(), z.string())),
});

export type LocalFile = z.infer<typeof LocalFile>;

export function emptyLocal(): LocalFile {
  return { version: 1, secrets: {} };
}
