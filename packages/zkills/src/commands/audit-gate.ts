import { auditFiles } from "../core/audit/scan.ts";
import { hasErrors } from "../core/lint/run.ts";
import type { FileMap } from "../core/types.ts";
import { fail } from "../io/ui.ts";
import type { Ctx } from "./context.ts";

// policy.requireAudit: refuse to write files the offline audit flags
export function auditGate(ctx: Ctx, name: string, files: FileMap): void {
  if (ctx.policy?.requireAudit !== true) return;
  const findings = auditFiles(files);
  if (!hasErrors(findings)) return;
  const rules = [...new Set(findings.filter((f) => f.level === "error").map((f) => f.rule))].join(
    ", ",
  );
  fail(`${name}: audit failed (${rules}), policy requireAudit blocks it`);
}
