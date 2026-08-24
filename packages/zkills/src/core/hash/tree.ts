import type { FileMap } from "../types.ts";
import { hashEntry, sha256 } from "./file.ts";

export type TreeHash = { tree: string; files: Record<string, string> };

export function sortedPaths(files: FileMap): string[] {
  return [...files.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

// Deterministic hash over sorted entries
export function hashTree(files: FileMap): TreeHash {
  const perFile: Record<string, string> = {};
  const parts: Buffer[] = [];
  for (const rel of sortedPaths(files)) {
    const entry = files.get(rel);
    if (!entry) continue;
    const hash = hashEntry(rel, entry.mode, entry.bytes);
    perFile[rel] = hash;
    parts.push(Buffer.from(`${rel}\0${hash}\n`, "utf8"));
  }
  return { tree: sha256(parts), files: perFile };
}
