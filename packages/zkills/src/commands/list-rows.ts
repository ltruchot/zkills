import { readSkillsLock } from "../core/interop/skills-lock.ts";
import { managedNames, unmanagedDirs } from "../core/lock/managed.ts";
import { listDirs } from "../io/dirs.ts";
import type { Bank } from "./banks.ts";
import type { Ctx } from "./context.ts";
import { bankRows, type Row } from "./list-bank-rows.ts";

export type { Row } from "./list-bank-rows.ts";

export const EXTERNAL_STATUS = "external, unmanaged, review manually";

// Bank skills, orphans, hand-written dirs, skills.sh externals
export async function listRows(ctx: Ctx, banks: Bank[]): Promise<Row[]> {
  const rows = await bankRows(ctx, banks);
  const seen = new Set(rows.map((r) => r.name));
  for (const name of managedNames(ctx.lock).filter((n) => !seen.has(n))) {
    rows.push({
      name,
      where: ctx.lock.skills[name]?.source ?? "?",
      status: "orphan, gone from bank",
      description: "",
    });
  }
  for (const name of unmanagedDirs(ctx.lock, await listDirs(ctx.p.skills))) {
    rows.push({ name, where: "local", status: "unmanaged, hand-written", description: "" });
  }
  for (const ext of await readSkillsLock(ctx.p.root)) {
    rows.push({ name: ext.name, where: ext.source, status: EXTERNAL_STATUS, description: "" });
  }
  return rows;
}
