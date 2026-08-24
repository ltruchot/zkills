import type { Frontmatter } from "../schema/frontmatter.ts";
import type { Finding } from "../types.ts";

const BROAD = new Set(["*", "Bash", "Bash(*)", "Bash(*:*)"]);

function toolList(raw: unknown): string[] {
  if (typeof raw === "string") return raw.split(/[\s,]+/);
  if (Array.isArray(raw)) return raw.map(String);
  return [];
}

// Broad tool grants error, hooks warn
export function auditTools(fm: Frontmatter): Finding[] {
  const out: Finding[] = [];
  for (const tool of toolList(fm.data["allowed-tools"])) {
    if (BROAD.has(tool))
      out.push({ rule: "tools", level: "error", file: "SKILL.md", msg: `broad grant "${tool}"` });
  }
  if ("hooks" in fm.data)
    out.push({ rule: "tools", level: "warn", file: "SKILL.md", msg: "skill registers hooks" });
  return out;
}
