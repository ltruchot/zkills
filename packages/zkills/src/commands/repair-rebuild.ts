import { renderTree } from "../core/render/tree.ts";
import { swapDir } from "../io/atomic.ts";
import { snapshot } from "../io/backup.ts";
import { rmDir, writeTree } from "../io/fs.ts";
import { skillDir } from "../io/paths.ts";
import { fail, info, success } from "../io/ui.ts";
import { knownAnswers } from "./answers-known.ts";
import { type Bank, findSkill } from "./banks.ts";
import type { Ctx } from "./context.ts";
import { baseSkill } from "./update-base.ts";

// Rebuild one skill from lock: template at lock sha + answers, atomically
export async function rebuild(ctx: Ctx, banks: Bank[], name: string): Promise<void> {
  const entry = ctx.lock.skills[name];
  if (entry === undefined) fail(`${name} is not managed`);
  const found = findSkill(banks, name);
  const template = found === undefined ? undefined : await baseSkill(ctx, found, entry);
  const skill = template ?? found?.skill;
  if (skill === undefined) fail(`${name}: no template in cache or bank, try --from-backup`);
  const rendered = renderTree(skill.files, skill.manifest, knownAnswers(ctx, name, entry));
  if (ctx.dryRun) {
    info(`${name}: dry run, would rewrite ${rendered.size} file(s)`);
    return;
  }
  await snapshot(ctx.p, name);
  await swapDir(skillDir(ctx.p, name), async (work) => {
    await rmDir(work);
    await writeTree(work, rendered);
  });
  success(`${name}: rebuilt from lock`);
}
