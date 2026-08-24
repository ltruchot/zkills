import { join } from "node:path";
import { readSkill } from "../core/bank/index.ts";
import { type Skill, skillFromFiles } from "../core/bank/skill.ts";
import type { LockEntry } from "../core/schema/lock.ts";
import { resolveSource } from "../io/source.ts";
import { getTemplate } from "../io/template-cache.ts";
import { warn } from "../io/ui.ts";
import type { Found } from "./banks.ts";
import type { Ctx } from "./context.ts";

// Template as installed: cache → github at lock sha → none
export async function baseSkill(
  ctx: Ctx,
  found: Found,
  entry: LockEntry,
): Promise<Skill | undefined> {
  const cached = await getTemplate(entry.templateHash);
  if (cached !== null) return skillFromFiles(found.skill.name, "cache", cached);
  const source = found.bank.source;
  if (source.type === "github") {
    try {
      const old = await resolveSource(source, await ctx.token(), ctx.p.root, entry.sha);
      return await readSkill(join(old.dir, found.skill.name), found.skill.name);
    } catch (error) {
      warn(`no base at ${entry.sha.slice(0, 7)}: ${(error as Error).message}`);
    }
  }
  warn(`${found.skill.name}: base template unavailable, local edits become conflicts`);
  return undefined;
}
