import { z } from "zod";
import { SourceType } from "./lock.ts";

export const CONFIG_FILE = "zkills.config.json";

export const Source = z.object({
  repo: z.string().min(1),
  ref: z.string().min(1).default("main"),
  path: z.string().min(1).default("skills"),
  type: SourceType.default("github"),
  host: z.string().min(1).default("github.com"),
});

export const ConflictMode = z.enum(["inline", "rej", "ours", "theirs"]);

export const Policy = z.object({
  allowedSources: z.array(z.string()).optional(),
  denyFrontmatter: z.array(z.string()).optional(),
  requireAudit: z.boolean().default(false),
});

export const Config = z.object({
  version: z.literal(1),
  sources: z.array(Source).min(1),
  conflict: ConflictMode.optional(),
  policy: Policy.optional(),
});

export type Source = z.infer<typeof Source>;
export type ConflictMode = z.infer<typeof ConflictMode>;
export type Policy = z.infer<typeof Policy>;
export type Config = z.infer<typeof Config>;

export function defaultConfig(repo: string): Config {
  return Config.parse({ version: 1, sources: [{ repo }] });
}
