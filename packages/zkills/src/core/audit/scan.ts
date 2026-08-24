import { readTree } from "../../io/fs.ts";
import { isText } from "../hash/text.ts";
import { parseFrontmatter } from "../schema/frontmatter.ts";
import type { FileMap, Finding } from "../types.ts";
import { RULES } from "./rules.ts";
import { auditTools } from "./tools.ts";

const URL = /https?:\/\/[^\s)"'`]+/;

// Pattern scan over every text file, tools check on SKILL.md
export function auditFiles(files: FileMap): Finding[] {
  const out: Finding[] = [];
  for (const [rel, entry] of files) {
    if (!isText(entry.bytes)) continue;
    const text = entry.bytes.toString("utf8");
    for (const rule of RULES) {
      if (rule.re.test(text))
        out.push({ rule: rule.id, level: rule.level, file: rel, msg: rule.msg });
    }
    if (rel.startsWith("scripts/") && URL.test(text))
      out.push({ rule: "url", level: "warn", file: rel, msg: "script reaches network" });
    if (rel === "SKILL.md") out.push(...auditTools(parseFrontmatter(text)));
  }
  return out;
}

export async function scanDir(dir: string): Promise<Finding[]> {
  try {
    return auditFiles(await readTree(dir));
  } catch (error) {
    return [{ rule: "read", level: "error", msg: (error as Error).message }];
  }
}
