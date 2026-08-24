import { splitAnswers } from "../core/answers/split.ts";
import { isManaged } from "../core/lock/managed.ts";
import { checkPolicy } from "../core/policy.ts";
import { renderTree } from "../core/render/tree.ts";
import { exists, readTree, rmDir, writeTree } from "../io/fs.ts";
import { ensureLines } from "../io/gitignore.ts";
import { secretsFor, withSecrets } from "../io/local.ts";
import { skillDir } from "../io/paths.ts";
import { confirmOrYes } from "../io/prompts/confirm.ts";
import { putTemplate } from "../io/template-cache.ts";
import { fail, print, success } from "../io/ui.ts";
import { entryFor } from "./add-entry.ts";
import { collectAnswers } from "./add-prompts.ts";
import type { Found } from "./banks.ts";
import type { Ctx } from "./context.ts";
import { previewInstall } from "./preview.ts";

// Install or reinstall one skill, mutates ctx.lock and ctx.local
export async function addOne(ctx: Ctx, found: Found, force: boolean): Promise<void> {
  const { bank, skill } = found;
  const denied = checkPolicy(ctx.config.policy, bank.source, skill);
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
  if (!(await confirmOrYes(`Write ${skill.name} to ${dir}?`, ctx.yes))) return;
  if (present) await rmDir(dir);
  await writeTree(dir, rendered);
  await putTemplate(skill.templateHash, skill.files);
  ctx.lock.skills[skill.name] = entryFor(found, rendered, answers);
  const secret = splitAnswers(skill.manifest, answers).secret;
  ctx.local = withSecrets(ctx.local, skill.name, secret);
  if (Object.keys(secret).length > 0)
    await ensureLines(ctx.p.claudeGitignore, [`skills/${skill.name}/`]);
  success(`${skill.name} installed`);
}
