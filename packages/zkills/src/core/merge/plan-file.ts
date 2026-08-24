import { hashEntry } from "../hash/file.ts";
import type { ConflictMode } from "../schema/config.ts";
import type { FileEntry } from "../types.ts";
import { classifyFile } from "./classify.ts";
import { type PlanAction, planDrift } from "./plan-drift.ts";

export type { ActionKind, PlanAction } from "./plan-drift.ts";

export type FileInput = {
  rel: string;
  base?: FileEntry;
  theirs?: FileEntry;
  disk?: FileEntry;
  lockHash?: string;
  skip: boolean;
  mode: ConflictMode;
};

const hashOf = (rel: string, e?: FileEntry): string | undefined =>
  e === undefined ? undefined : hashEntry(rel, e.mode, e.bytes);

// Decide one file: write, merge, conflict, delete or keep
export function planFile(f: FileInput): PlanAction {
  const { rel, theirs, disk } = f;
  if (f.skip && disk !== undefined) return { rel, kind: "keep", reason: "skipIfExists" };
  const diskHash = hashOf(rel, disk);
  const theirsHash = hashOf(rel, theirs);
  switch (classifyFile(f.lockHash, diskHash, theirsHash)) {
    case "missing":
      return theirs === undefined ? { rel, kind: "keep" } : { rel, kind: "write", entry: theirs };
    case "extra":
      return { rel, kind: "keep", reason: "not managed" };
    case "removed":
      return diskHash === f.lockHash
        ? { rel, kind: "delete" }
        : { rel, kind: "keep", reason: "local edits" };
    case "same":
      return diskHash === theirsHash
        ? { rel, kind: "keep" }
        : { rel, kind: "write", entry: theirs };
    case "drift":
      return planDrift({
        rel,
        base: f.base,
        disk: disk as FileEntry,
        theirs: theirs as FileEntry,
        mode: f.mode,
      });
  }
}
