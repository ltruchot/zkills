import type { Skill } from "../bank/skill.ts";
import { isText } from "../hash/text.ts";
import type { Finding } from "../types.ts";

const SHELL_INLINE = /(^|\s)!`[^`]+`/m;
const SHELL_FENCE = /^```!/m;
const TOKEN_IN_NAME = /^name:.*\{\{/m;

// Shell injection warns, placeholder in name errors
export function lintSyntax(skill: Skill): Finding[] {
  const out: Finding[] = [];
  for (const [rel, entry] of skill.files) {
    if (!isText(entry.bytes)) continue;
    const text = entry.bytes.toString("utf8");
    if (SHELL_INLINE.test(text) || SHELL_FENCE.test(text)) {
      out.push({
        rule: "syntax",
        level: "warn",
        file: rel,
        msg: "shell injection !`cmd`, review before install",
      });
    }
    if (rel === "SKILL.md" && TOKEN_IN_NAME.test(text)) {
      out.push({
        rule: "syntax",
        level: "error",
        file: rel,
        msg: "placeholder in name is forbidden",
      });
    }
  }
  return out;
}
