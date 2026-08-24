import type { Policy } from "./schema/config.ts";

// Preset rules can only tighten: intersect allowlists, union denylists, OR audit
export function mergePolicy(preset?: Policy, project?: Policy): Policy | undefined {
  if (preset === undefined) return project;
  if (project === undefined) return preset;
  const allowed =
    preset.allowedSources === undefined
      ? project.allowedSources
      : preset.allowedSources.filter((s) => project.allowedSources?.includes(s) ?? true);
  const denied = [
    ...new Set([...(preset.denyFrontmatter ?? []), ...(project.denyFrontmatter ?? [])]),
  ];
  return {
    ...(allowed === undefined ? {} : { allowedSources: allowed }),
    ...(denied.length === 0 ? {} : { denyFrontmatter: denied }),
    requireAudit: preset.requireAudit || project.requireAudit,
  };
}
