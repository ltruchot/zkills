import { isManaged } from "../core/lock/managed.ts";
import { checkPolicy } from "../core/policy.ts";
import { renderTree } from "../core/render/tree.ts";
import { exists, readTree } from "../io/fs.ts";
import { secretsFor } from "../io/local.ts";
import { skillDir } from "../io/paths.ts";
import { confirmOrYes } from "../io/prompts/confirm.ts";
import { fail, info, print, success } from "../io/ui.ts";
import { collectAnswers } from "./add-prompts.ts";
import { installFiles } from "./add-write.ts";
import type { Found } from "./banks.ts";
import type { Ctx } from "./context.ts";
import { previewInstall } from "./preview.ts";

// Install or reinstall one skill, mutates ctx.lock and ctx.local
export async function addOne(ctx: Ctx, found: Found, force: boolean): Promise<void> {
  const { bank, skill } = found;
  const denied = checkPolicy(ctx.policy, bank.source, skill);
  if (denied !== null) fail(`${skill.name}: ${denied}`);
  const dir = skillDir(ctx.p, skill.name);
  const present = await exists(dir);
  if (present && !isManaged(ctx.lock, skill.name) && !force)
    fail(`${dir} exists and is unmanaged, use --force`);
  const entry = ctx.lock.skills[skill.name];
  const known = { ...entry?.answers, ...secretsFor(ctx.local, skill.name) };
  const answers = await collectAnswers(skill.manifest, known, ctx.yes);
  const rendered = renderTree(skill.files, skill.manifest, answers);
  print(previewInstall(rendered, present ? await readTree(dir) : null));
  if (ctx.dryRun) {
    info(`${skill.name}: dry run, nothing written`);
    return;
  }
  if (!(await confirmOrYes(`Write ${skill.name} to ${dir}?`, ctx.yes))) return;
  await installFiles(ctx, found, rendered, answers);
  success(`${skill.name} installed`);
}
