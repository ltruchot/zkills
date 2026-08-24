import { appendFile, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, FIXTURES, project } from "../helpers/cli.ts";
import { parseAs, readLockFile, Rows } from "../helpers/json.ts";
import { cleanup } from "../helpers/tmp.ts";

const ANSWERS = { ZKILLS_ANSWER_PROJECT_NAME: "Acme" };

test("init, add, check, list, drift, remove", async () => {
  const dir = await project("bank-v1");
  const lockPath = join(dir, ".claude/zkills.lock.json");
  await mkdir(join(dir, ".claude/skills/manual"), { recursive: true });
  await writeFile(join(dir, ".claude/skills/manual/SKILL.md"), "hand written");
  await copyFile(join(FIXTURES, "skills-lock.json"), join(dir, "skills-lock.json"));

  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  expect(await readFile(join(dir, ".claude/.gitignore"), "utf8")).toContain("zkills.local.json");

  expect((await cli(dir, ["add", "hello", "-y"], ANSWERS)).code).toBe(0);
  const skill = await readFile(join(dir, ".claude/skills/hello/SKILL.md"), "utf8");
  expect(skill).toContain("Project: Acme");
  expect(skill).toContain("Repo: Gods-Academy/example");
  expect(skill).toContain("{{NOT_DECLARED}}");
  expect(skill).toContain("$ARGUMENTS");
  const entry = (await readLockFile(lockPath)).skills["hello"];
  expect(entry?.answers).toStrictEqual({
    GITHUB_REPO: "Gods-Academy/example",
    PROJECT_NAME: "Acme",
  });
  expect(entry?.sha).toMatch(/^local:/);

  expect((await cli(dir, ["check"])).code).toBe(0);
  const list = parseAs(Rows, (await cli(dir, ["list", "--json"])).out);
  expect(list.map((r) => `${r.name}=${r.status}`)).toStrictEqual([
    "hello=up to date",
    "manual=unmanaged, hand-written",
    "angular-developer=external, unmanaged, review manually",
  ]);

  await appendFile(join(dir, ".claude/skills/hello/SKILL.md"), "- my edit\n");
  expect((await cli(dir, ["check"])).code).toBe(2);

  expect((await cli(dir, ["remove", "manual", "-y"])).code).toBe(1);
  expect((await cli(dir, ["remove", "hello", "-y"])).code).toBe(0);
  expect((await readLockFile(lockPath)).skills).toStrictEqual({});
  expect((await cli(dir, ["add", "hello", "-y"], {})).code).toBe(1);
  await cleanup(dir);
});
