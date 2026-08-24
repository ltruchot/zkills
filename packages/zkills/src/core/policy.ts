import type { Skill } from "./bank/skill.ts";
import type { Policy, Source } from "./schema/config.ts";

// Null = allowed, string = reason
export function checkPolicy(
  policy: Policy | undefined,
  source: Source,
  skill: Skill,
): string | null {
  if (policy === undefined) return null;
  if (policy.allowedSources !== undefined && !policy.allowedSources.includes(source.repo)) {
    return `source ${source.repo} not in allowedSources`;
  }
  const denied = (policy.denyFrontmatter ?? []).filter((key) => key in skill.frontmatter.data);
  if (denied.length > 0) return `frontmatter denied by policy: ${denied.join(", ")}`;
  return null;
}
