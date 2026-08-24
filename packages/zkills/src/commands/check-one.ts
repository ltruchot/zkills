import { homedir } from "node:os";
import { join } from "node:path";
import { hashTree } from "../core/hash/tree.ts";
import { renderTree } from "../core/render/tree.ts";
import type { LockEntry } from "../core/schema/lock.ts";
import type { Status } from "../core/status/buckets.ts";
import { computeStatus } from "../core/status/compute.ts";
import { exists } from "../io/fs.ts";
import { secretsFor } from "../io/local.ts";
import { readSkillDisk } from "../io/skill-disk.ts";
import { warn } from "../io/ui.ts";
import { type Bank, findSkill } from "./banks.ts";
import type { Ctx } from "./context.ts";

// Statuses for one managed skill, tamper check under --frozen
export async function checkOne(
  ctx: Ctx,
  banks: Bank[],
  name: string,
  entry: LockEntry,
  frozen: boolean,
): Promise<Status[]> {
  const found = findSkill(banks, name);
  const skill = found?.skill;
  let frozenRenderedHash: string | undefined;
  if (frozen && skill !== undefined && skill.templateHash === entry.templateHash) {
    const answers = { ...entry.answers, ...secretsFor(ctx.local, name) };
    frozenRenderedHash = hashTree(renderTree(skill.files, skill.manifest, answers)).tree;
  }
  const statuses = computeStatus({
    entry,
    disk: await readSkillDisk(ctx.p, name),
    configRef: found?.bank.source.ref,
    bankTemplateHash: skill?.templateHash,
    frozenRenderedHash,
  });
  if (frozen && frozenRenderedHash === undefined) statuses.push("unverified");
  if (await exists(join(homedir(), ".claude", "skills", name))) {
    warn(`~/.claude/skills/${name} shadows the project skill`);
  }
  return statuses.filter((s, i, all) => s !== "ok" || all.length === 1);
}
