import { z } from "zod";

export const SHA40 = /^[0-9a-f]{40}$/;
export const SHA256 = /^[0-9a-f]{64}$/;

export const SourceType = z.enum(["github", "local"]);

export const LockEntry = z.object({
  source: z.string().min(1),
  sourceType: SourceType,
  ref: z.string().min(1),
  sha: z.string().min(1),
  skillPath: z.string().min(1),
  path: z.string().min(1),
  templateHash: z.string().regex(SHA256),
  renderedHash: z.string().regex(SHA256),
  files: z.record(z.string(), z.string().regex(SHA256)),
  answers: z.record(z.string(), z.string()),
  secrets: z.array(z.string()),
});

export const LockFile = z.object({
  version: z.literal(1),
  skills: z.record(z.string(), LockEntry),
});

export type LockEntry = z.infer<typeof LockEntry>;
export type LockFile = z.infer<typeof LockFile>;

export function emptyLock(): LockFile {
  return { version: 1, skills: {} };
}
