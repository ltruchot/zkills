import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { resolveToken } from "../../src/io/auth.ts";
import { cachePath } from "../../src/io/cache.ts";
import { isSha } from "../../src/io/gh-api.ts";
import { ensureLines, removeLines } from "../../src/io/gitignore.ts";
import { readLocal, writeLocal, withSecrets } from "../../src/io/local.ts";
import { findRoot, paths } from "../../src/io/paths.ts";
import { fetchLocal } from "../../src/io/source-local.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

test("token precedence and fallback", async () => {
  expect(await resolveToken({ GH_TOKEN: "gh", ZKILLS_TOKEN: "zk" }, async () => null)).toBe("zk");
  expect(await resolveToken({ GITHUB_TOKEN: "" }, async () => "cli")).toBe("cli");
  expect(await resolveToken({}, async () => null)).toBeNull();
});

test("gitignore lines idempotent", async () => {
  const dir = await tmpDir();
  const file = join(dir, ".gitignore");
  expect(await ensureLines(file, ["a", "b"])).toBe(true);
  expect(await ensureLines(file, ["a"])).toBe(false);
  expect(await removeLines(file, ["a"])).toBe(true);
  expect(await readFile(file, "utf8")).toBe("b\n");
  await cleanup(dir);
});

test("local secrets file is private and sorted", async () => {
  const dir = await tmpDir();
  const p = paths(dir);
  await writeLocal(p, withSecrets(await readLocal(p), "x", { B: "2", A: "1" }));
  expect((await stat(p.local)).mode & 0o777).toBe(0o600);
  expect(await readFile(p.local, "utf8")).toContain('"A": "1",\n      "B": "2"');
  expect(withSecrets(await readLocal(p), "x", {}).secrets).toEqual({});
  await cleanup(dir);
});

test("paths, cache, sha, local bank", async () => {
  expect(findRoot("/nonexistent/deep")).toBe("/nonexistent/deep");
  expect(cachePath("o/r", "abc", { XDG_CACHE_HOME: "/c" })).toBe("/c/zkills/github/o_r/abc");
  expect(isSha("a".repeat(40))).toBe(true);
  expect(isSha("main")).toBe(false);
  const bank = join(import.meta.dirname, "../fixtures/bank-v1");
  const res = await fetchLocal(bank, "skills", "/");
  expect(res.sha).toMatch(/^local:[0-9a-f]{64}$/);
  expect(res.dir).toBe(join(bank, "skills"));
});
