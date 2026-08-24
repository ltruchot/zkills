import { expect, test } from "vite-plus/test";
import { hashTree } from "../../src/core/hash/tree.ts";
import type { LockEntry } from "../../src/core/schema/lock.ts";
import { computeStatus } from "../../src/core/status/compute.ts";
import { exitCode } from "../../src/core/status/exit-code.ts";
import { MODE_FILE, type FileMap } from "../../src/core/types.ts";

const disk: FileMap = new Map([["SKILL.md", { bytes: Buffer.from("ok\n"), mode: MODE_FILE }]]);
const tree = hashTree(disk);
const entry: LockEntry = {
  source: "o/r",
  sourceType: "github",
  ref: "main",
  sha: "a".repeat(40),
  skillPath: "skills/x",
  path: ".claude/skills/x",
  templateHash: "b".repeat(64),
  renderedHash: tree.tree,
  files: tree.files,
  answers: {},
  secrets: [],
};

test("status buckets", () => {
  expect(computeStatus({ entry, disk })).toEqual(["ok"]);
  expect(computeStatus({ entry, disk: null })).toEqual(["missing"]);
  expect(computeStatus({ entry, disk, bankTemplateHash: "c".repeat(64) })).toEqual(["update"]);
  expect(computeStatus({ entry, disk, configRef: "dev" })).toEqual(["wrong-ref"]);
  expect(computeStatus({ entry, disk, frozenRenderedHash: "d".repeat(64) })).toEqual(["tamper"]);
  const edited: FileMap = new Map([
    ["SKILL.md", { bytes: Buffer.from("<<<<<<< local\nx\n"), mode: MODE_FILE }],
  ]);
  expect(computeStatus({ entry, disk: edited })).toEqual(["drift", "conflict"]);
});

test("exit codes", () => {
  expect(exitCode(["ok", "ok"])).toBe(0);
  expect(exitCode(["ok", "update"])).toBe(1);
  expect(exitCode(["update", "drift"])).toBe(2);
  expect(exitCode(["drift", "tamper"])).toBe(3);
});
