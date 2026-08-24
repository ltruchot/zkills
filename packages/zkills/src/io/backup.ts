import { createHash } from "node:crypto";
import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { cacheRoot } from "./cache.ts";
import { exists } from "./fs.ts";
import { type Paths, skillDir } from "./paths.ts";

// One previous state per project and skill, outside the repo
export function backupPath(p: Paths, name: string): string {
  const project = createHash("sha256").update(p.root).digest("hex").slice(0, 16);
  return join(cacheRoot(), "backup", project, name);
}

export function hasBackup(p: Paths, name: string): Promise<boolean> {
  return exists(backupPath(p, name));
}

// Copy the current skill dir to its backup slot, no-op when absent
export async function snapshot(p: Paths, name: string): Promise<void> {
  const dir = skillDir(p, name);
  if (!(await exists(dir))) return;
  const backup = backupPath(p, name);
  await rm(backup, { recursive: true, force: true });
  await mkdir(dirname(backup), { recursive: true });
  await cp(dir, backup, { recursive: true });
}

// Put the backup back in place through a work dir
export async function restoreBackup(p: Paths, name: string): Promise<void> {
  const from = backupPath(p, name);
  if (!(await exists(from))) throw new Error(`no backup for ${name}`);
  const dir = skillDir(p, name);
  const work = `${dir}.zk-work-${process.pid}`;
  await rm(work, { recursive: true, force: true });
  await cp(from, work, { recursive: true });
  await rm(dir, { recursive: true, force: true });
  await cp(work, dir, { recursive: true });
  await rm(work, { recursive: true, force: true });
}
