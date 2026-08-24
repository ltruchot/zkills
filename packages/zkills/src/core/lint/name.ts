import type { Skill } from "../bank/skill.ts";
import type { Finding } from "../types.ts";

export const SKILL_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RESERVED = ["claude", "anthropic"];

// name = dir name, kebab, ≤64, no reserved words
export function lintName(skill: Skill): Finding[] {
  const out: Finding[] = [];
  const name = skill.frontmatter.data["name"];
  const push = (msg: string): number =>
    out.push({ rule: "name", level: "error", file: "SKILL.md", msg });
  if (typeof name !== "string") push("frontmatter name required");
  else if (name !== skill.name) push(`name "${name}" must equal dir "${skill.name}"`);
  if (!SKILL_NAME.test(skill.name)) push(`dir "${skill.name}" must match ${SKILL_NAME}`);
  if (skill.name.length > 64) push("name over 64 chars");
  for (const word of RESERVED)
    if (skill.name.includes(word)) push(`name contains reserved "${word}"`);
  return out;
}
