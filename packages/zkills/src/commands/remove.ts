import type { CAC } from "cac";
import { isManaged } from "../core/lock/managed.ts";
import { rmDir } from "../io/fs.ts";
import { removeLines } from "../io/gitignore.ts";
import { withSecrets, writeLocal } from "../io/local.ts";
import { writeLock } from "../io/lock.ts";
import { skillDir } from "../io/paths.ts";
import { confirmOrYes } from "../io/prompts/confirm.ts";
import { fail, info, intro, outro, success } from "../io/ui.ts";
import { type GlobalOpts, loadContext } from "./context.ts";

// Managed skills only: dir, lock entry, secrets, gitignore line
export async function runRemove(names: string[], opts: GlobalOpts): Promise<void> {
  intro("zkills remove");
  const ctx = await loadContext(opts);
  if (names.length === 0) fail("name at least one skill");
  for (const name of names) {
    if (!isManaged(ctx.lock, name)) fail(`${name} is not managed by zkills`);
  }
  if (ctx.dryRun) {
    info(`dry run, would remove ${names.join(", ")}`);
    return;
  }
  if (!(await confirmOrYes(`Remove ${names.join(", ")}?`, ctx.yes))) return;
  for (const name of names) {
    await rmDir(skillDir(ctx.p, name));
    Reflect.deleteProperty(ctx.lock.skills, name);
    ctx.local = withSecrets(ctx.local, name, {});
    await removeLines(ctx.p.claudeGitignore, [`skills/${name}/`]);
    success(`${name} removed`);
  }
  await writeLock(ctx.p, ctx.lock);
  await writeLocal(ctx.p, ctx.local);
  outro("done");
}

export function register(cli: CAC): void {
  cli.command("remove [...names]", "Uninstall managed skills").alias("rm").action(runRemove);
}
