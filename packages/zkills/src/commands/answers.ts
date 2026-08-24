import type { CAC } from "cac";
import pc from "picocolors";
import { validateAnswer } from "../core/answers/validate.ts";
import type { Answers } from "../core/types.ts";
import { writeLocal } from "../io/local.ts";
import { writeLock } from "../io/lock.ts";
import { askPlaceholder } from "../io/prompts/placeholder.ts";
import { fail, intro, outro, print } from "../io/ui.ts";
import { ENV_PREFIX } from "./add-prompts.ts";
import { findSkill, loadBanks } from "./banks.ts";
import { type GlobalOpts, loadContext } from "./context.ts";
import { baseSkill } from "./update-base.ts";
import { applyUpdate, knownAnswers } from "./update-one.ts";

type Opts = GlobalOpts & { edit?: boolean };

// Show placeholders, re-prompt and re-render with --edit
export async function runAnswers(name: string, opts: Opts): Promise<void> {
  intro("zkills answers");
  const ctx = await loadContext(opts);
  const entry = ctx.lock.skills[name];
  if (entry === undefined) fail(`${name} is not managed`);
  const known = knownAnswers(ctx, name, entry);
  print(
    Object.keys(known)
      .sort()
      .map((k) => `${k} = ${entry.secrets.includes(k) ? pc.dim("••••") : known[k]}`),
  );
  if (opts.edit !== true) return outro("use --edit to change");
  const found = findSkill(await loadBanks(ctx), name);
  if (found === undefined) fail(`${name}: gone from bank`);
  const answers: Answers = { ...known };
  for (const decl of found.skill.manifest.placeholders) {
    const fromEnv = process.env[`${ENV_PREFIX}${decl.name}`];
    if (fromEnv !== undefined && validateAnswer(decl, fromEnv) === null)
      answers[decl.name] = fromEnv;
    else if (!ctx.yes) answers[decl.name] = await askPlaceholder(decl, known[decl.name]);
  }
  const base = await baseSkill(ctx, found, entry);
  await applyUpdate(ctx, { found, entry, base, answers });
  await writeLock(ctx.p, ctx.lock);
  await writeLocal(ctx.p, ctx.local);
  outro("done");
}

export function register(cli: CAC): void {
  cli
    .command("answers <name>", "Show or edit placeholder answers")
    .option("--edit", "Re-prompt and re-render")
    .action(runAnswers);
}
