import { expect, test } from "vite-plus/test";
import { hashBytes } from "../../src/core/hash/file.ts";
import { lintDescription } from "../../src/core/lint/description.ts";
import { lintSize } from "../../src/core/lint/size.ts";
import { hasConflictMarkers } from "../../src/core/merge/three-way.ts";
import { skillFromFiles } from "../../src/core/bank/skill.ts";
import { MODE_FILE, type FileMap } from "../../src/core/types.ts";

const fm = (md: string): FileMap =>
  new Map([["SKILL.md", { bytes: Buffer.from(md), mode: MODE_FILE }]]);

test("conflict markers need all three lines", () => {
  expect(hasConflictMarkers("docs say `<<<<<<< HEAD` marks a conflict\n")).toBe(false);
  expect(hasConflictMarkers("<<<<<<< local\na\n=======\nb\n>>>>>>> zkills update\n")).toBe(true);
  expect(hasConflictMarkers("=======\n")).toBe(false);
});

test("hash corners: empty, lone CR, NUL past sniff window", () => {
  expect(hashBytes(Buffer.alloc(0))).toBe(hashBytes(Buffer.from("")));
  expect(hashBytes(Buffer.from("\r"))).toBe(hashBytes(Buffer.from("\n")));
  const late = Buffer.concat([Buffer.alloc(9000, 0x61), Buffer.from([0])]);
  expect(hashBytes(late)).toBe(hashBytes(late));
});

test("lint boundaries: description 1024, SKILL.md 500 lines", () => {
  const ok = skillFromFiles("s", "/s", fm(`---\nname: s\ndescription: ${"d".repeat(1024)}\n---\n`));
  const over = skillFromFiles(
    "s",
    "/s",
    fm(`---\nname: s\ndescription: ${"d".repeat(1025)}\n---\n`),
  );
  expect(lintDescription(ok)).toStrictEqual([]);
  expect(lintDescription(over)[0]?.msg).toMatch(/1024/);
  expect(
    lintSize(skillFromFiles("s", "/s", fm(`---\nname: s\n---\n${"x\n".repeat(496)}`))),
  ).toStrictEqual([]);
  expect(
    lintSize(skillFromFiles("s", "/s", fm(`---\nname: s\n---\n${"x\n".repeat(600)}`)))[0]?.level,
  ).toBe("error");
});
