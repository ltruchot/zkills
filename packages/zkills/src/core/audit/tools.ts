import type { Frontmatter } from "../schema/frontmatter.ts";
import type { Finding } from "../types.ts";

const BROAD = new Set(["*", "Bash", "Bash(*)", "Bash(*:*)"]);

// Broad tool grants error, hooks warn
export function auditTools(fm: Frontmatter): Finding[] {
  const out: Finding[] = [];
  const raw = fm.data["allowed-tools"];
  const tools =
    typeof raw === "string" ? raw.split(/[\s,]+/) : Array.isArray(raw) ? raw.map(String) : [];
  for (const tool of tools) {
    if (BROAD.has(tool))
      out.push({ rule: "tools", level: "error", file: "SKILL.md", msg: `broad grant "${tool}"` });
  }
  if ("hooks" in fm.data)
    out.push({ rule: "tools", level: "warn", file: "SKILL.md", msg: "skill registers hooks" });
  return out;
}
