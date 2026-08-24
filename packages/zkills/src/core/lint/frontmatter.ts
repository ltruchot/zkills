import type { Skill } from "../bank/skill.ts";
import type { Finding } from "../types.ts";
import { CLAUDE_KEYS, PORTABLE_KEYS } from "./keys.ts";

export { CLAUDE_KEYS, PORTABLE_KEYS } from "./keys.ts";

const finding = (level: Finding["level"], msg: string): Finding => ({
  rule: "frontmatter",
  level,
  file: "SKILL.md",
  msg,
});

// Unknown keys warn, non-portable keys error under --portable
export function lintFrontmatter(skill: Skill, portable: boolean): Finding[] {
  const out: Finding[] = [];
  for (const key of Object.keys(skill.frontmatter.data)) {
    if (!CLAUDE_KEYS.includes(key)) out.push(finding("warn", `unknown key "${key}"`));
    else if (portable && !PORTABLE_KEYS.includes(key))
      out.push(finding("error", `"${key}" is Claude Code only, not portable`));
  }
  return out;
}
