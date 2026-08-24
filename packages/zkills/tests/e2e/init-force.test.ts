import { mkdir, writeFile } from "node:fs/promises";
import { exists } from "../../src/io/fs.ts";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, project } from "../helpers/cli.ts";
import { cleanup } from "../helpers/tmp.ts";

test("init keeps existing config, list human output, force replaces unmanaged", async () => {
  const dir = await project("bank-v1");
  expect((await cli(dir, ["init", "Other/bank", "-y"])).out).toContain("exists, keeping it");
  await mkdir(join(dir, ".claude/skills/hello"), { recursive: true });
  await writeFile(join(dir, ".claude/skills/hello/SKILL.md"), "mine");
  const env = { ZKILLS_ANSWER_PROJECT_NAME: "Acme" };
  expect((await cli(dir, ["add", "hello", "-y"], env)).out).toContain("unmanaged, use --force");
  expect((await cli(dir, ["add", "hello", "-y", "--force"], env)).code).toBe(0);
  expect((await cli(dir, ["list"])).out).toContain("up to date");
  expect((await cli(dir, ["remove"])).out).toContain("at least one");
  expect((await cli(dir, ["answers", "ghost"])).out).toContain("not managed");
  await cleanup(dir);
});

test("dry run previews and writes nothing", async () => {
  const dir = await project("bank-v1");
  const env = { ZKILLS_ANSWER_PROJECT_NAME: "Acme" };
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  const dry = await cli(dir, ["add", "hello", "-y", "--dry-run"], env);
  expect(dry.code).toBe(0);
  expect(dry.out).toContain("dry run");
  expect(await exists(join(dir, ".claude/skills/hello"))).toBe(false);
  expect((await cli(dir, ["add", "hello", "-y"], env)).code).toBe(0);
  expect((await cli(dir, ["remove", "hello", "--dry-run"])).out).toContain("would remove");
  expect(await exists(join(dir, ".claude/skills/hello"))).toBe(true);
  await cleanup(dir);
});
