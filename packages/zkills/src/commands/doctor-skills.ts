import { managedNames } from "../core/lock/managed.ts";
import { LOCAL_FILE } from "../core/schema/local.ts";
import { STATUS_LABEL } from "../core/status/buckets.ts";
import { computeStatus } from "../core/status/compute.ts";
import type { Finding } from "../core/types.ts";
import { hasBackup } from "../io/backup.ts";
import { secretsFor } from "../io/local.ts";
import { readSkillDisk } from "../io/skill-disk.ts";
import type { Ctx } from "./context.ts";
import { finding } from "./doctor-project.ts";

// Per-skill checks: disk state, secrets presence, backup availability
export async function skillChecks(ctx: Ctx): Promise<Finding[]> {
  const out: Finding[] = [];
  for (const name of managedNames(ctx.lock)) {
    const entry = ctx.lock.skills[name];
    if (entry === undefined) continue;
    for (const s of computeStatus({ entry, disk: await readSkillDisk(ctx.p, name) })) {
      if (s === "ok") continue;
      const fix = (await hasBackup(ctx.p, name))
        ? "zkills repair or repair --from-backup"
        : "zkills repair";
      out.push(
        finding(s, s === "missing" ? "error" : "warn", `${name}: ${STATUS_LABEL[s]}, ${fix}`),
      );
    }
    const secrets = secretsFor(ctx.local, name);
    for (const key of entry.secrets) {
      if (secrets[key] === undefined)
        out.push(
          finding(
            "secret",
            "error",
            `${name}: secret ${key} missing in ${LOCAL_FILE}, zkills answers ${name} --edit`,
          ),
        );
    }
  }
  return out;
}
