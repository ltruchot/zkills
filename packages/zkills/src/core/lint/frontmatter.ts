import type { Skill } from "../bank/skill.ts";
import type { Finding } from "../types.ts";

// Agent Skills open spec
export const PORTABLE_KEYS = [
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
];

// Claude Code extensions
export const CLAUDE_KEYS = [
  ...PORTABLE_KEYS,
  "when_to_use",
  "argument-hint",
  "arguments",
  "disable-model-invocation",
  "user-invocable",
  "disallowed-tools",
  "model",
  "effort",
  "context",
  "agent",
  "background",
  "hooks",
  "paths",
  "shell",
];

// Unknown keys warn, non-portable keys error under --portable
export function lintFrontmatter(skill: Skill, portable: boolean): Finding[] {
  const out: Finding[] = [];
  for (const key of Object.keys(skill.frontmatter.data)) {
    if (!CLAUDE_KEYS.includes(key))
      out.push({
        rule: "frontmatter",
        level: "warn",
        file: "SKILL.md",
        msg: `unknown key "${key}"`,
      });
    else if (portable && !PORTABLE_KEYS.includes(key)) {
      out.push({
        rule: "frontmatter",
        level: "error",
        file: "SKILL.md",
        msg: `"${key}" is Claude Code only, not portable`,
      });
    }
  }
  return out;
}
