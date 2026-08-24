import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, project } from "../helpers/cli.ts";
import { cleanup } from "../helpers/tmp.ts";

test("path-shaped names are rejected on every command and in the lock", async () => {
  const dir = await project("bank-v1");
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  for (const args of [
    ["add", "../x"],
    ["remove", "../../etc"],
    ["update", "a/b"],
    ["answers", ".."],
    ["repair", "A"],
  ]) {
    const run = await cli(dir, [...args, "-y"]);
    expect(run.code).toBe(1);
    expect(run.out).toContain("invalid skill name");
  }
  const lockPath = join(dir, ".claude/zkills.lock.json");
  const lock = JSON.parse(await readFile(lockPath, "utf8")) as { skills: Record<string, unknown> };
  lock.skills["../evil"] = {
    source: "x",
    sourceType: "local",
    ref: "main",
    sha: "s",
    skillPath: "skills/evil",
    path: ".claude/skills/../evil",
    templateHash: "a".repeat(64),
    renderedHash: "a".repeat(64),
    files: {},
    answers: {},
    secrets: [],
  };
  await writeFile(lockPath, JSON.stringify(lock));
  const poisoned = await cli(dir, ["remove", "evil", "-y"]);
  expect(poisoned.code).toBe(1);
  expect(poisoned.out).toContain("invalid");
  expect(poisoned.out).toContain("zkills.lock.json");
  await cleanup(dir);
});
