import { splitAnswers } from "../core/answers/split.ts";
import type { Skill } from "../core/bank/skill.ts";
import { buildPlan, summarize } from "../core/merge/plan.ts";
import { renderTree } from "../core/render/tree.ts";
import type { LockEntry } from "../core/schema/lock.ts";
import type { Answers, FileMap } from "../core/types.ts";
import { secretsFor, withSecrets } from "../io/local.ts";
import { skillDir } from "../io/paths.ts";
import { confirmOrYes } from "../io/prompts/confirm.ts";
import { readSkillDisk } from "../io/skill-disk.ts";
import { putTemplate } from "../io/template-cache.ts";
import { info, print, success, warn } from "../io/ui.ts";
import { entryFor } from "./add-entry.ts";
import type { Found } from "./banks.ts";
import type { Ctx } from "./context.ts";
import { previewPlan } from "./preview.ts";
import { applyPlan } from "./update-apply.ts";

export type UpdateInput = { found: Found; entry: LockEntry; base?: Skill; answers: Answers };

export function knownAnswers(ctx: Ctx, name: string, entry: LockEntry): Answers {
  return { ...entry.answers, ...secretsFor(ctx.local, name) };
}

// 3-way merge old render → disk ← new render, lock keeps pure render
export async function applyUpdate(ctx: Ctx, input: UpdateInput): Promise<boolean> {
  const { found, entry, answers } = input;
  const { skill } = found;
  const name = skill.name;
  const oldAnswers = knownAnswers(ctx, name, entry);
  const base: FileMap =
    input.base === undefined
      ? new Map()
      : renderTree(input.base.files, input.base.manifest, oldAnswers);
  const theirs = renderTree(skill.files, skill.manifest, answers);
  const disk = (await readSkillDisk(ctx.p, name)) ?? new Map();
  const plan = buildPlan({
    base,
    theirs,
    disk,
    lockFiles: entry.files,
    skip: skill.manifest.skipIfExists,
    mode: ctx.config.conflict,
  });
  const summary = summarize(plan);
  if (Object.keys(summary).every((k) => k === "keep")) {
    info(`${name}: nothing to write`);
  } else {
    print(previewPlan(plan, disk));
    if (!(await confirmOrYes(`Apply to ${skillDir(ctx.p, name)}?`, ctx.yes))) return false;
  }
  const applied = await applyPlan(skillDir(ctx.p, name), plan);
  await putTemplate(skill.templateHash, skill.files);
  ctx.lock.skills[name] = entryFor(found, theirs, answers);
  ctx.local = withSecrets(ctx.local, name, splitAnswers(skill.manifest, answers).secret);
  if (applied.conflicts.length > 0)
    warn(`${name}: resolve conflicts in ${applied.conflicts.join(", ")}`);
  else success(`${name}: ${applied.changed} file(s) written`);
  return true;
}
