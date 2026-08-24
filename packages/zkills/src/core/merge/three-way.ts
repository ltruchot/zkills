import { merge } from "node-diff3";

export type MergeResult = { text: string; conflict: boolean };

const LABELS = { a: "local", o: "zkills base", b: "zkills update" };

// base = old render, ours = disk, theirs = new render
export function mergeThreeWay(base: string, ours: string, theirs: string): MergeResult {
  const res = merge(ours, base, theirs, {
    stringSeparator: /\n/,
    excludeFalseConflicts: true,
    label: LABELS,
  });
  return { text: res.result.join("\n"), conflict: res.conflict };
}

export const CONFLICT_MARK = /^<{7} /m;

export function hasConflictMarkers(text: string): boolean {
  return CONFLICT_MARK.test(text);
}
