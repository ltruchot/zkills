import type { CAC } from "cac";
import pc from "picocolors";
import { managedNames, unmanagedDirs } from "../core/lock/managed.ts";
import { STATUS_LABEL, type Status } from "../core/status/buckets.ts";
import { exitCode } from "../core/status/exit-code.ts";
import { listDirs } from "../io/dirs.ts";
import { spin } from "../io/spin.ts";
import { info, outro, print } from "../io/ui.ts";
import { type Bank, loadBanks } from "./banks.ts";
import { checkOne } from "./check-one.ts";
import { type GlobalOpts, loadContext } from "./context.ts";
import { cmdIntro } from "./intro.ts";

type Opts = GlobalOpts & { frozen?: boolean; offline?: boolean };

const paint = (s: Status): string =>
  s === "ok" ? pc.green(STATUS_LABEL[s]) : pc.red(STATUS_LABEL[s]);

// Exit 0 ok, 1 update, 2 drift, 3 tamper; an unreachable bank fails, CI never goes green blind
export async function runCheck(opts: Opts): Promise<number> {
  cmdIntro("check");
  const ctx = await loadContext(opts);
  const banks: Bank[] =
    opts.offline === true ? [] : await spin("fetch banks", () => loadBanks(ctx));
  const all: Status[] = [];
  const lines: string[] = [];
  for (const name of managedNames(ctx.lock)) {
    const entry = ctx.lock.skills[name];
    if (entry === undefined) continue;
    const statuses = await checkOne(ctx, banks, name, entry, opts.frozen === true);
    all.push(...statuses);
    lines.push(`${name}: ${statuses.map(paint).join(", ")}`);
  }
  print(lines);
  const unmanaged = unmanagedDirs(ctx.lock, await listDirs(ctx.p.skills));
  if (unmanaged.length > 0) info(`unmanaged: ${unmanaged.join(", ")}`);
  const code = exitCode(all);
  outro(code === 0 ? pc.green("all good") : pc.red(`exit ${code}`));
  return code;
}

export function register(cli: CAC): void {
  cli
    .command("check", "Report skill status, exit code for CI")
    .option("--frozen", "Also verify lock against bank template")
    .option("--offline", "Skip bank fetch, disk and lock only")
    .action(runCheck);
}
