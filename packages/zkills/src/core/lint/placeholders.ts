import type { Skill } from "../bank/skill.ts";
import { isText } from "../hash/text.ts";
import { scanTokens } from "../render/tokens.ts";
import { declaredNames, MANIFEST_FILE } from "../schema/manifest.ts";
import type { Finding } from "../types.ts";

// Every {{TOKEN}} declared, every declaration used
export function lintPlaceholders(skill: Skill): Finding[] {
  const declared = declaredNames(skill.manifest);
  const used = new Set<string>();
  const out: Finding[] = [];
  for (const [rel, entry] of skill.files) {
    if (rel === MANIFEST_FILE || !isText(entry.bytes)) continue;
    for (const token of scanTokens(entry.bytes.toString("utf8"))) {
      used.add(token);
      if (!declared.has(token))
        out.push({
          rule: "placeholders",
          level: "error",
          file: rel,
          msg: `{{${token}}} not declared in ${MANIFEST_FILE}`,
        });
    }
  }
  for (const name of declared) {
    if (!used.has(name))
      out.push({
        rule: "placeholders",
        level: "warn",
        file: MANIFEST_FILE,
        msg: `${name} declared but unused`,
      });
  }
  return out;
}
