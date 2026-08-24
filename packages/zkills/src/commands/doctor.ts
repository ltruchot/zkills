import type { CAC } from "cac";
import { hasErrors } from "../core/lint/run.ts";
import { intro, outro, print } from "../io/ui.ts";
import { type GlobalOpts, loadContext } from "./context.ts";
import { projectChecks } from "./doctor-project.ts";
import { skillChecks } from "./doctor-skills.ts";
import { formatFindings, jsonFindings } from "./findings.ts";

// Everything that can go wrong locally, with the fix in the message
export async function runDoctor(opts: GlobalOpts): Promise<number> {
  const ctx = await loadContext(opts);
  const findings = [...(await projectChecks(ctx)), ...(await skillChecks(ctx))];
  if (ctx.json) print([jsonFindings({ project: findings })]);
  else {
    intro(`${ctx.preset.name} doctor`);
    print(formatFindings(ctx.p.root, findings));
    outro(hasErrors(findings) ? "fix errors, then zkills repair or zkills add" : "healthy");
  }
  return hasErrors(findings) ? 1 : 0;
}

export function register(cli: CAC): void {
  cli.command("doctor", "Diagnose config, token, lock, secrets, skills").action(runDoctor);
}
