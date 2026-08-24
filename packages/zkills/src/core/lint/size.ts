import { type Skill, SKILL_FILE } from "../bank/skill.ts";
import type { Finding } from "../types.ts";

export const MAX_LINES = 500;
export const MAX_TOKENS = 5000;

// Anthropic guidance: SKILL.md under 500 lines, ~5k tokens
export function lintSize(skill: Skill): Finding[] {
  const text = skill.files.get(SKILL_FILE)?.bytes.toString("utf8") ?? "";
  const lines = text.split("\n").length;
  const tokens = Math.ceil(text.length / 4);
  const out: Finding[] = [];
  if (lines > MAX_LINES)
    out.push({
      rule: "size",
      level: "error",
      file: SKILL_FILE,
      msg: `${lines} lines, max ${MAX_LINES}`,
    });
  if (tokens > MAX_TOKENS)
    out.push({
      rule: "size",
      level: "warn",
      file: SKILL_FILE,
      msg: `~${tokens} tokens, aim under ${MAX_TOKENS}`,
    });
  return out;
}
