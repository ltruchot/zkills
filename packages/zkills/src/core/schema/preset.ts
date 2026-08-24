import { z } from "zod";
import { ConflictMode, Policy, Source } from "./config.ts";

export const Link = z.object({ label: z.string().min(1), url: z.string().min(1) });

// Enterprise flavor: defaults and rules a wrapper package ships
export const Preset = z.object({
  name: z.string().min(1).default("zkills"),
  sources: z.array(Source).min(1).optional(),
  policy: Policy.optional(),
  conflict: ConflictMode.optional(),
  links: z.array(Link).default([]),
  notes: z.array(z.string().min(1)).default([]),
});

export type Preset = z.infer<typeof Preset>;

export function emptyPreset(): Preset {
  return Preset.parse({});
}
