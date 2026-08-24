import { writeLocal } from "../io/local.ts";
import { writeLock } from "../io/lock.ts";
import { fail, info } from "../io/ui.ts";
import { collectAnswers } from "./add-prompts.ts";
import { type Bank, findSkill } from "./banks.ts";
import type { Ctx } from "./context.ts";
import { baseSkill } from "./update-base.ts";
import { applyUpdate, knownAnswers } from "./update-one.ts";

// Update one managed skill and persist lock + secrets
export async function updateName(
  ctx: Ctx,
  banks: Bank[],
  name: string,
  force: boolean,
): Promise<void> {
  const entry = ctx.lock.skills[name];
  if (entry === undefined) fail(`${name} is not managed, use zkills add`);
  const found = findSkill(banks, name);
  if (found === undefined) fail(`${name}: gone from bank, remove it or keep as is`);
  if (found.skill.templateHash === entry.templateHash && !force) {
    info(`${name}: up to date`);
    return;
  }
  const base = await baseSkill(ctx, found, entry);
  const answers = await collectAnswers(
    found.skill.manifest,
    knownAnswers(ctx, name, entry),
    ctx.yes,
  );
  await applyUpdate(ctx, { found, entry, base, answers });
  await writeLock(ctx.p, ctx.lock);
  await writeLocal(ctx.p, ctx.local);
}
