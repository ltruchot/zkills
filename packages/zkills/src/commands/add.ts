import type { CAC } from "cac";
import { managedNames } from "../core/lock/managed.ts";
import { exists } from "../io/fs.ts";
import { writeLocal } from "../io/local.ts";
import { writeLock } from "../io/lock.ts";
import { skillDir } from "../io/paths.ts";
import { fail, intro, outro, spin } from "../io/ui.ts";
import { addOne } from "./add-one.ts";
import { findSkill, loadBanks } from "./banks.ts";
import { type Ctx, type GlobalOpts, loadContext } from "./context.ts";

type Opts = GlobalOpts & { force?: boolean };

// No names = restore every locked skill missing on disk
async function targets(ctx: Ctx, names: string[]): Promise<string[]> {
  if (names.length > 0) return names;
  const missing: string[] = [];
  for (const name of managedNames(ctx.lock)) {
    if (!(await exists(skillDir(ctx.p, name)))) missing.push(name);
  }
  if (missing.length === 0) fail("nothing to add: name a skill or restore missing ones");
  return missing;
}

export async function runAdd(names: string[], opts: Opts): Promise<void> {
  intro("zkills add");
  const ctx = await loadContext(opts);
  const banks = await spin("fetch banks", () => loadBanks(ctx));
  for (const name of await targets(ctx, names)) {
    const found = findSkill(banks, name);
    if (found === undefined) fail(`unknown skill: ${name}`);
    await addOne(ctx, found, opts.force === true);
    await writeLock(ctx.p, ctx.lock);
    await writeLocal(ctx.p, ctx.local);
  }
  outro("done");
}

export function register(cli: CAC): void {
  cli
    .command("add [...names]", "Install skills from the bank, prompt placeholders")
    .option("--force", "Replace unmanaged dir with same name")
    .action(runAdd);
}
