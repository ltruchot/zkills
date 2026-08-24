import { cp, mkdir, rename, rm } from "node:fs/promises";
import { exists } from "./fs.ts";

// Mutate a copy, swap it in with one rename; caller snapshots a backup first
export async function swapDir<T>(dir: string, mutate: (work: string) => Promise<T>): Promise<T> {
  const work = `${dir}.zk-work-${process.pid}`;
  await rm(work, { recursive: true, force: true });
  const present = await exists(dir);
  await (present ? cp(dir, work, { recursive: true }) : mkdir(work, { recursive: true }));
  let result: T;
  try {
    result = await mutate(work);
  } catch (error) {
    await rm(work, { recursive: true, force: true });
    throw error;
  }
  if (present) await rm(dir, { recursive: true, force: true });
  await rename(work, dir);
  return result;
}

export function isWorkDir(name: string): boolean {
  return name.includes(".zk-work-");
}
