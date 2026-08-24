import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, project } from "../helpers/cli.ts";
import { cleanup } from "../helpers/tmp.ts";

const ANSWERS = { ZKILLS_ANSWER_PROJECT_NAME: "Acme" };

test("init, add, check, list, drift, remove", async () => {
  const dir = await project("bank-v1");
  await mkdir(join(dir, ".claude/skills/manual"), { recursive: true });
  await writeFile(join(dir, ".claude/skills/manual/SKILL.md"), "hand written");

  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  expect(await readFile(join(dir, ".claude/.gitignore"), "utf8")).toContain("zkills.local.json");

  const add = await cli(dir, ["add", "hello", "-y"], ANSWERS);
  expect(add.code, add.out).toBe(0);
  const skill = await readFile(join(dir, ".claude/skills/hello/SKILL.md"), "utf8");
  expect(skill).toContain("Project: Acme");
  expect(skill).toContain("Repo: Gods-Academy/example");
  expect(skill).toContain("{{NOT_DECLARED}}");
  expect(skill).toContain("$ARGUMENTS");
  const lock = JSON.parse(await readFile(join(dir, ".claude/zkills.lock.json"), "utf8"));
  expect(lock.skills.hello.answers).toEqual({
    GITHUB_REPO: "Gods-Academy/example",
    PROJECT_NAME: "Acme",
  });
  expect(lock.skills.hello.sha).toMatch(/^local:/);

  expect((await cli(dir, ["check"])).code).toBe(0);
  const list = JSON.parse((await cli(dir, ["list", "--json"])).out);
  expect(list.map((r: { name: string; status: string }) => `${r.name}=${r.status}`)).toEqual([
    "hello=up to date",
    "manual=unmanaged, hand-written",
  ]);

  await appendFile(join(dir, ".claude/skills/hello/SKILL.md"), "- my edit\n");
  expect((await cli(dir, ["check"])).code).toBe(2);

  expect((await cli(dir, ["remove", "manual", "-y"])).code).toBe(1);
  expect((await cli(dir, ["remove", "hello", "-y"])).code).toBe(0);
  expect(JSON.parse(await readFile(join(dir, ".claude/zkills.lock.json"), "utf8")).skills).toEqual(
    {},
  );
  expect((await cli(dir, ["add", "hello", "-y"], {})).code).toBe(1);
  await cleanup(dir);
}, 60_000);
