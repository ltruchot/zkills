import pc from "picocolors";
import type { Finding } from "../core/types.ts";

// Findings for one dir, human or json
export function formatFindings(dir: string, findings: Finding[]): string[] {
  if (findings.length === 0) return [`${pc.green("✓")} ${dir}`];
  const lines = [`${pc.red("✗")} ${dir}`];
  for (const f of findings) {
    const level = f.level === "error" ? pc.red("error") : pc.yellow("warn");
    lines.push(`  ${level} ${pc.dim(f.rule)} ${f.file ?? ""} ${f.msg}`);
  }
  return lines;
}

export function jsonFindings(results: Record<string, Finding[]>): string {
  return JSON.stringify(results, null, 2);
}
