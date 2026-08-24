import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

const env = { ZKILLS_ANSWER_PROJECT_NAME: "Acme", ZKILLS_ANSWER_TEAM: "web" };
const skill = (dir: string): string => join(dir, ".claude/skills/hello/SKILL.md");

async function seed(mode: string): Promise<{ dir: string; env: Record<string, string> }> {
  const dir = await project("bank-v1");
  const all = { ...env, XDG_CACHE_HOME: await tmpDir("zkills-cache-") };
  await setBank(dir, "bank-v1", { conflict: mode });
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  expect((await cli(dir, ["add", "hello", "-y"], all)).code).toBe(0);
  const text = await readFile(skill(dir), "utf8");
  await writeFile(skill(dir), text.replace("- Say hello\n", "- Say hello loudly\n"));
  await setBank(dir, "bank-v2", { conflict: mode });
  return { dir, env: all };
}

test("inline conflict markers, check reports conflict", async () => {
  const { dir, env: all } = await seed("inline");
  expect((await cli(dir, ["update", "-y"], all)).code).toBe(0);
  const text = await readFile(skill(dir), "utf8");
  expect(text).toContain("<<<<<<< local");
  expect(text).toContain("Say hello loudly");
  expect(text).toContain("Say hello twice");
  const check = await cli(dir, ["check", "--offline"]);
  expect(check.code).toBe(2);
  expect(check.out).toContain("conflict markers");
  await cleanup(dir);
});

test("rej mode keeps ours and writes .zk-rej, ours and theirs modes", async () => {
  const { dir, env: all } = await seed("rej");
  expect((await cli(dir, ["update", "-y"], all)).code).toBe(0);
  expect(await readFile(skill(dir), "utf8")).toContain("Say hello loudly");
  expect(await readFile(`${skill(dir)}.zk-rej`, "utf8")).toContain("Say hello twice");
  await setBank(dir, "bank-v1", { conflict: "theirs" });
  expect((await cli(dir, ["update", "-y"], all)).code).toBe(0);
  expect(await readFile(skill(dir), "utf8")).toContain("- Say hello\n");
  await cleanup(dir);
});
