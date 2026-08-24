import type { CAC } from "cac";
import { isManaged, managedNames } from "../core/lock/managed.ts";
import { assertSkillNames } from "../core/names.ts";
import { hasBackup, restoreBackup } from "../io/backup.ts";
import { fail, intro, outro, success } from "../io/ui.ts";
import { loadBanks } from "./banks.ts";
import { type GlobalOpts, loadContext } from "./context.ts";
import { rebuild } from "./repair-rebuild.ts";

type Opts = GlobalOpts & { fromBackup?: boolean };

// Rebuild from lock, or restore the last backup taken before any write
export async function runRepair(names: string[], opts: Opts): Promise<void> {
  intro("zkills repair");
  const ctx = await loadContext(opts);
  const targets = names.length > 0 ? assertSkillNames(names) : managedNames(ctx.lock);
  const banks = opts.fromBackup === true ? [] : await loadBanks(ctx, false);
  for (const name of targets) {
    if (!isManaged(ctx.lock, name)) fail(`${name} is not managed, use zkills add`);
    if (opts.fromBackup !== true) {
      await rebuild(ctx, banks, name);
      continue;
    }
    if (!(await hasBackup(ctx.p, name))) fail(`${name}: no backup`);
    if (!ctx.dryRun) await restoreBackup(ctx.p, name);
    success(`${name}: restored from backup`);
  }
  outro("run zkills check to confirm");
}

export function register(cli: CAC): void {
  cli
    .command("repair [...names]", "Rebuild skills from lock, or restore last backup")
    .option("--from-backup", "Restore the state saved before the last write")
    .action(runRepair);
}
