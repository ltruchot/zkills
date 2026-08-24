import { description } from "../core/bank/skill.ts";
import { STATUS_LABEL } from "../core/status/buckets.ts";
import { computeStatus } from "../core/status/compute.ts";
import { readSkillDisk } from "../io/skill-disk.ts";
import type { Bank } from "./banks.ts";
import type { Ctx } from "./context.ts";

export type Row = { name: string; where: string; status: string; description: string };

// One row per bank skill: available, or lock status
export async function bankRows(ctx: Ctx, banks: Bank[]): Promise<Row[]> {
  const rows: Row[] = [];
  for (const bank of banks) {
    for (const skill of bank.skills) {
      const entry = ctx.lock.skills[skill.name];
      let status = "available";
      if (entry !== undefined) {
        const statuses = computeStatus({
          entry,
          disk: await readSkillDisk(ctx.p, skill.name),
          configRef: bank.source.ref,
          bankTemplateHash: skill.templateHash,
        });
        status = statuses.map((s) => STATUS_LABEL[s]).join(", ");
      }
      rows.push({
        name: skill.name,
        where: bank.source.repo,
        status,
        description: description(skill),
      });
    }
  }
  return rows;
}
