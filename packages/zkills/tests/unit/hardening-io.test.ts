import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { validateAnswer } from "../../src/core/answers/validate.ts";
import { Placeholder } from "../../src/core/schema/placeholder.ts";
import { writeJson } from "../../src/io/json.ts";
import { readTarGz, safeRel } from "../../src/io/tar.ts";
import { fakeBankTarball } from "../helpers/tarball.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

test("backslash paths refused, gunzip output capped", async () => {
  expect(() => safeRel(String.raw`a\..\b`)).toThrow(/unsafe/);
  expect(() => safeRel(String.raw`skills\x`)).toThrow(/unsafe/);
  const gz = await fakeBankTarball();
  expect(readTarGz(gz, "skills").size).toBeGreaterThan(0);
  expect(() => readTarGz(gz, "skills", 64)).toThrow(/larger than/);
});

test("bank regex runs on bounded values, pattern length capped", () => {
  const decl = Placeholder.parse({ name: "A", prompt: "a", pattern: "^(a+)+$" });
  expect(validateAnswer(decl, "aaa")).toBeNull();
  expect(validateAnswer(decl, "a".repeat(2000))).toMatch(/over 1024/);
  expect(Placeholder.safeParse({ name: "A", prompt: "a", pattern: "x".repeat(201) }).success).toBe(
    false,
  );
});

test("writeJson leaves no temp file behind when the rename fails", async () => {
  const dir = await tmpDir("zkills-json-");
  await mkdir(join(dir, "x.json"));
  await expect(writeJson(join(dir, "x.json"), { a: 1 })).rejects.toThrow(
    /EISDIR|ENOTDIR|directory/,
  );
  expect(await readdir(dir)).toStrictEqual(["x.json"]);
  await cleanup(dir);
});
