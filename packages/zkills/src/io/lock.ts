import { emptyLock, LockFile } from "../core/schema/lock.ts";
import { readJson, writeJson } from "./json.ts";
import type { Paths } from "./paths.ts";

export async function readLock(p: Paths): Promise<LockFile> {
  return readJson(p.lock, LockFile, emptyLock);
}

export async function writeLock(p: Paths, lock: LockFile): Promise<void> {
  await writeJson(p.lock, lock);
}
