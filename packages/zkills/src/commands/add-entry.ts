import { buildEntry } from "../core/lock/entry.ts";
import type { LockEntry } from "../core/schema/lock.ts";
import type { Answers, FileMap } from "../core/types.ts";
import { type Found, sourceOf } from "./banks.ts";

// Lock entry for a freshly rendered skill
export function entryFor(found: Found, rendered: FileMap, answers: Answers): LockEntry {
  const { bank, skill } = found;
  return buildEntry({
    ...sourceOf(bank),
    ref: bank.source.ref,
    sha: bank.resolved.sha,
    skillPath: `${bank.source.path}/${skill.name}`,
    path: `.claude/skills/${skill.name}`,
    template: skill.files,
    rendered,
    manifest: skill.manifest,
    answers,
  });
}
