import type { Skill } from "../bank/skill.ts";
import type { Finding } from "../types.ts";

const XML = /<[a-zA-Z/][^>]*>/;

// 1..1024 chars, no XML tags
export function lintDescription(skill: Skill): Finding[] {
  const value = skill.frontmatter.data["description"];
  const error = (msg: string): Finding[] => [
    { rule: "description", level: "error", file: "SKILL.md", msg },
  ];
  if (typeof value !== "string" || value.trim().length === 0) return error("description required");
  if (value.length > 1024) return error("description over 1024 chars");
  if (XML.test(value)) return error("description contains XML tag");
  return [];
}
