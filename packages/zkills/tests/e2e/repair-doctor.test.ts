import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { Findings, parseAs } from "../helpers/json.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

test("repair rebuilds from lock, restores backup; doctor reports and exits", async () => {
  const dir = await project("bank-v1");
  const env = { ZKILLS_ANSWER_PROJECT_NAME: "Acme", XDG_CACHE_HOME: await tmpDir("zkills-cache-") };
  const skill = join(dir, ".claude/skills/hello/SKILL.md");
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  expect((await cli(dir, ["add", "hello", "-y"], env)).code).toBe(0);
  expect((await cli(dir, ["doctor", "--json"], env)).code).toBe(0);

  await writeFile(skill, "corrupted");
  await rm(join(dir, ".claude/skills/hello/references"), { recursive: true });
  const sick = await cli(dir, ["doctor", "--json"], env);
  expect(parseAs(Findings, sick.out)["project"]?.length).toBeGreaterThan(0);
  expect((await cli(dir, ["repair", "-y"], env)).code).toBe(0);
  expect(await readFile(skill, "utf8")).toContain("Project: Acme");
  expect((await cli(dir, ["check", "--offline"], env)).code).toBe(0);

  await setBank(dir, "bank-v2");
  expect((await cli(dir, ["update", "-y"], { ...env, ZKILLS_ANSWER_TEAM: "core" })).code).toBe(0);
  expect(await readFile(skill, "utf8")).toContain("Team: core");
  expect((await cli(dir, ["repair", "hello", "--from-backup"], env)).code).toBe(0);
  expect(await readFile(skill, "utf8")).not.toContain("Team:");

  await rm(join(dir, ".claude/skills/hello"), { recursive: true });
  const missing = await cli(dir, ["doctor"], env);
  expect(missing.code).toBe(1);
  expect(missing.out).toContain("missing on disk");
  expect((await cli(dir, ["repair", "-y"], env)).code).toBe(0);
  expect((await cli(dir, ["remove", "hello", "-y"], env)).code).toBe(0);
  expect((await cli(dir, ["repair", "hello", "--from-backup"], env)).out).toContain("not managed");
  await cleanup(dir);
  await cleanup(env.XDG_CACHE_HOME);
});
