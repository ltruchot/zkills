import type { CAC } from "cac";
import { scanDir } from "../core/audit/scan.ts";
import { hasErrors } from "../core/lint/run.ts";
import { managedNames } from "../core/lock/managed.ts";
import type { Finding } from "../core/types.ts";
import { skillDir } from "../io/paths.ts";
import { print } from "../io/ui.ts";
import { type GlobalOpts, loadContext } from "./context.ts";
import { formatFindings, jsonFindings } from "./findings.ts";

// Offline scan, default = managed skills of this project
export async function runAudit(dirs: string[], opts: GlobalOpts): Promise<void> {
  let targets = dirs;
  if (targets.length === 0) {
    const ctx = await loadContext(opts);
    targets = managedNames(ctx.lock).map((name) => skillDir(ctx.p, name));
  }
  const results: Record<string, Finding[]> = {};
  for (const dir of targets) results[dir] = await scanDir(dir);
  if (opts.json === true) console.log(jsonFindings(results));
  else for (const [dir, findings] of Object.entries(results)) print(formatFindings(dir, findings));
  if (Object.values(results).some(hasErrors)) process.exitCode = 1;
}

export function register(cli: CAC): void {
  cli.command("audit [...dirs]", "Scan skills for dangerous patterns").action(runAudit);
}
