import type { CAC } from "cac";
import { managedNames } from "../core/lock/managed.ts";
import { EXTERNAL_WARNING, runExternalUpdate } from "../io/external.ts";
import { writeLocal } from "../io/local.ts";
import { writeLock } from "../io/lock.ts";
import { fail, info, intro, note, outro, spin } from "../io/ui.ts";
import { collectAnswers } from "./add-prompts.ts";
import { findSkill, loadBanks } from "./banks.ts";
import { type GlobalOpts, loadContext } from "./context.ts";
import { baseSkill } from "./update-base.ts";
import { applyUpdate, knownAnswers } from "./update-one.ts";

type Opts = GlobalOpts & { force?: boolean; external?: boolean };

// Update managed skills, then optionally delegate externals
export async function runUpdate(names: string[], opts: Opts): Promise<void> {
  intro("zkills update");
  const ctx = await loadContext(opts);
  const banks = await spin("fetch banks", () => loadBanks(ctx));
  for (const name of names.length > 0 ? names : managedNames(ctx.lock)) {
    const entry = ctx.lock.skills[name];
    if (entry === undefined) fail(`${name} is not managed, use zkills add`);
    const found = findSkill(banks, name);
    if (found === undefined) fail(`${name}: gone from bank, remove it or keep as is`);
    if (found.skill.templateHash === entry.templateHash && opts.force !== true) {
      info(`${name}: up to date`);
      continue;
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
  if (opts.external === true) {
    note(EXTERNAL_WARNING, "external skills");
    process.exitCode = await runExternalUpdate(ctx.p.root);
  }
  outro("done");
}

export function register(cli: CAC): void {
  cli
    .command("update [...names]", "Merge bank changes, keep local edits")
    .option("--force", "Re-render even when template unchanged")
    .option("--external", "Also run npx skills update for skills.sh skills")
    .action(runUpdate);
}
