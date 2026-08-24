import type { CAC } from "cac";
import { hasErrors, lintSkill } from "../core/lint/run.ts";
import type { Finding } from "../core/types.ts";
import { fail, print } from "../io/ui.ts";
import type { GlobalOpts } from "./context.ts";
import { formatFindings, jsonFindings } from "./findings.ts";

type Opts = GlobalOpts & { portable?: boolean };

// Bank CI gate: exit 1 on any error
export async function runLint(dirs: string[], opts: Opts): Promise<number> {
  if (dirs.length === 0) fail("usage: zkills lint skills/*");
  const results: Record<string, Finding[]> = {};
  for (const dir of dirs) results[dir] = await lintSkill(dir, { portable: opts.portable === true });
  if (opts.json === true) print([jsonFindings(results)]);
  else for (const [dir, findings] of Object.entries(results)) print(formatFindings(dir, findings));
  return Object.values(results).some(hasErrors) ? 1 : 0;
}

export function register(cli: CAC): void {
  cli
    .command("lint [...dirs]", "Validate skill dirs against the spec")
    .option("--portable", "Allow only the 6 open-spec frontmatter keys")
    .action(runLint);
}
