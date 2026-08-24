import { chmod, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, FIXTURES, project } from "../helpers/cli.ts";
import { Findings, parseAs } from "../helpers/json.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

test("lint and audit through the cli, json and human", async () => {
  const dir = await project("bank-v1");
  const bad = join(FIXTURES, "bank-bad/skills/curl-sh");
  const good = join(FIXTURES, "bank-secret/skills/vault");
  expect((await cli(dir, ["lint", good, "--portable"])).code).toBe(0);
  const lint = await cli(dir, ["lint", bad, "--json"]);
  expect(lint.code).toBe(0);
  expect(parseAs(Findings, lint.out)[bad]).toStrictEqual([]);
  expect((await cli(dir, ["lint"])).out).toContain("usage");
  const audit = await cli(dir, ["audit", bad]);
  expect(audit.code).toBe(1);
  expect(audit.out).toContain("pipe-shell");
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  expect((await cli(dir, ["audit", "--json"])).out.trim()).toBe("{}");
  await cleanup(dir);
});

test("update --external delegates to npx skills with a warning", async () => {
  const dir = await project("bank-v1");
  const bin = await tmpDir("zkills-bin-");
  await mkdir(bin, { recursive: true });
  await writeFile(join(bin, "npx"), '#!/bin/sh\necho fake-npx "$@"\nexit 7\n');
  await chmod(join(bin, "npx"), 0o755);
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  const run = await cli(dir, ["update", "--external", "-y"], {
    PATH: `${bin}:${process.env["PATH"] ?? ""}`,
  });
  expect(run.code).toBe(7);
  expect(run.out).toContain("review them manually");
  await cleanup(dir);
  await cleanup(bin);
});
