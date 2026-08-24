import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { exists } from "../../io/fs.ts";

export const SKILLS_SH_LOCK = "skills-lock.json";

const SkillsShLock = z.object({
  skills: z.record(z.string(), z.object({ source: z.string().optional() }).loose()),
});

export type External = { name: string; source: string };

// Skills installed by npx skills (skills.sh), tolerant parse
export async function readSkillsLock(root: string): Promise<External[]> {
  const file = join(root, SKILLS_SH_LOCK);
  if (!(await exists(file))) return [];
  const parsed = SkillsShLock.safeParse(JSON.parse(await readFile(file, "utf8")));
  if (!parsed.success) return [];
  return Object.entries(parsed.data.skills)
    .map(([name, e]) => ({ name, source: e.source ?? "unknown" }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
