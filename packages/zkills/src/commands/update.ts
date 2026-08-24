import type { CAC } from "cac";
import { managedNames } from "../core/lock/managed.ts";
import { EXTERNAL_WARNING, runExternalUpdate } from "../io/external.ts";
import { spin } from "../io/spin.ts";
import { intro, note, outro } from "../io/ui.ts";
import { loadBanks } from "./banks.ts";
import { type GlobalOpts, loadContext } from "./context.ts";
import { updateName } from "./update-name.ts";

type Opts = GlobalOpts & { force?: boolean; external?: boolean };

// Update managed skills, then optionally delegate externals
export async function runUpdate(names: string[], opts: Opts): Promise<number> {
  intro("zkills update");
  const ctx = await loadContext(opts);
  const banks = await spin("fetch banks", () => loadBanks(ctx));
  for (const name of names.length > 0 ? names : managedNames(ctx.lock)) {
    await updateName(ctx, banks, name, opts.force === true);
  }
  let code = 0;
  if (opts.external === true) {
    note(EXTERNAL_WARNING, "external skills");
    code = await runExternalUpdate(ctx.p.root);
  }
  outro("done");
  return code;
}

export function register(cli: CAC): void {
  cli
    .command("update [...names]", "Merge bank changes, keep local edits")
    .option("--force", "Re-render even when template unchanged")
    .option("--external", "Also run npx skills update for skills.sh skills")
    .action(runUpdate);
}
