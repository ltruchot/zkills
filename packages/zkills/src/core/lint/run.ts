import { basename } from "node:path";
import { readSkill } from "../bank/index.ts";
import type { Finding } from "../types.ts";
import { lintDescription } from "./description.ts";
import { lintFrontmatter } from "./frontmatter.ts";
import { lintName } from "./name.ts";
import { lintPlaceholders } from "./placeholders.ts";
import { lintSize } from "./size.ts";
import { lintSyntax } from "./syntax.ts";

export type LintOptions = { portable: boolean };

// All rules for one skill dir; unreadable skill = single error
export async function lintSkill(dir: string, opts: LintOptions): Promise<Finding[]> {
  let skill;
  try {
    skill = await readSkill(dir, basename(dir));
  } catch (error) {
    return [{ rule: "read", level: "error", msg: (error as Error).message }];
  }
  return [
    ...lintName(skill),
    ...lintDescription(skill),
    ...lintSize(skill),
    ...lintFrontmatter(skill, opts.portable),
    ...lintPlaceholders(skill),
    ...lintSyntax(skill),
  ];
}

export function hasErrors(findings: Finding[]): boolean {
  return findings.some((f) => f.level === "error");
}
