import { gzipSync } from "node:zlib";
import { expect, test } from "vite-plus/test";
import { MODE_EXEC, MODE_FILE } from "../../src/core/types.ts";
import { readTarGz, safeRel } from "../../src/io/tar.ts";
import { fakeBankTarball, ustarHeader } from "../helpers/tarball.ts";

test("reads regular files under subdir, drops root segment, keeps exec bit", async () => {
  const files = readTarGz(await fakeBankTarball(), "skills");
  expect([...files.keys()].toSorted()).toStrictEqual(["hello/SKILL.md", "hello/scripts/run.sh"]);
  expect(files.get("hello/SKILL.md")?.mode).toBe(MODE_FILE);
  expect(files.get("hello/scripts/run.sh")?.mode).toBe(MODE_EXEC);
  expect(files.get("hello/SKILL.md")?.bytes.toString()).toContain("body");
  expect(readTarGz(await fakeBankTarball(), "nope").size).toBe(0);
});

test("traversal, absolute paths and links are refused", () => {
  expect(() => safeRel("a/../b")).toThrow(/unsafe/);
  expect(() => safeRel("/etc/passwd")).toThrow(/unsafe/);
  expect(safeRel("a//b/")).toBe("a/b");
  const evil = gzipSync(Buffer.concat([ustarHeader("root/../../evil"), Buffer.alloc(1024)]));
  expect(() => readTarGz(evil, "")).toThrow(/unsafe/);
  const link = gzipSync(Buffer.concat([ustarHeader("root/skills/x", "2"), Buffer.alloc(1024)]));
  expect(() => readTarGz(link, "skills")).toThrow(/link refused/);
});
