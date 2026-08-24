import { appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

const read = (dir: string): Promise<string> =>
  readFile(join(dir, ".claude/skills/hello/SKILL.md"), "utf8");

test("update merges upstream changes and keeps local edits", async () => {
  const dir = await project("bank-v1");
  const env = { XDG_CACHE_HOME: await tmpDir("zkills-cache-"), ZKILLS_ANSWER_PROJECT_NAME: "Acme" };
  expect((await cli(dir, ["init", "-y"], env)).code).toBe(0);
  expect((await cli(dir, ["add", "hello", "-y"], env)).code).toBe(0);
  expect((await cli(dir, ["update", "-y"], env)).out).toContain("up to date");

  await setBank(dir, "bank-v2");
  expect((await cli(dir, ["check"], env)).code).toBe(1);
  expect((await cli(dir, ["update", "-y"], env)).code).toBe(1);
  const up = await cli(dir, ["update", "-y"], { ...env, ZKILLS_ANSWER_TEAM: "core" });
  expect(up.code, up.out).toBe(0);
  expect(await read(dir)).toContain("Team: core");
  expect(await read(dir)).toContain("Say hello twice");
  expect(await readFile(join(dir, ".claude/skills/hello/references/guide.md"), "utf8")).toContain(
    "Version 2",
  );
  expect((await cli(dir, ["check"], env)).code).toBe(0);

  await appendFile(join(dir, ".claude/skills/hello/SKILL.md"), "- my edit\n");
  expect((await cli(dir, ["check"], env)).code).toBe(2);
  await setBank(dir, "bank-v1");
  const back = await cli(dir, ["update", "-y"], env);
  expect(back.code, back.out).toBe(0);
  expect(await read(dir)).toContain("- my edit");
  expect(await read(dir)).not.toContain("Team:");
  expect(await read(dir)).toContain("- Say hello\n");
  expect((await cli(dir, ["check"], env)).code).toBe(2);

  const shown = await cli(dir, ["answers", "hello"], env);
  expect(shown.out).toContain("PROJECT_NAME = Acme");
  const edit = await cli(dir, ["answers", "hello", "--edit", "-y"], {
    ...env,
    ZKILLS_ANSWER_PROJECT_NAME: "Beta",
  });
  expect(edit.code, edit.out).toBe(0);
  expect(await read(dir)).toContain("Project: Beta");
  expect(await read(dir)).toContain("- my edit");
  await cleanup(dir);
  await cleanup(env.XDG_CACHE_HOME);
}, 90_000);
