import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, FIXTURES } from "../helpers/cli.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

test("preset drives init, info and a policy the project cannot widen", async () => {
  const dir = await tmpDir("zkills-preset-");
  const bank = join(FIXTURES, "bank-secret");
  const preset = {
    name: "acme-skills",
    sources: [{ repo: bank, type: "local" }],
    policy: { denyFrontmatter: ["allowed-tools"] },
    links: [{ label: "wiki", url: "https://wiki.acme.internal/skills" }],
    notes: ["ask #skills on slack before adding a skill"],
  };
  const file = join(dir, "preset.json");
  await writeFile(file, JSON.stringify(preset));
  const env = {
    ZKILLS_PRESET: file,
    ZKILLS_ANSWER_VAULT_URL: "https://v.test",
    ZKILLS_ANSWER_TOKEN: "t",
  };
  const init = await cli(dir, ["init", "-y"], env);
  expect(init.code).toBe(0);
  expect(init.out).toContain("acme-skills init");
  expect(JSON.parse(await readFile(join(dir, "zkills.config.json"), "utf8"))).toMatchObject({
    sources: [{ repo: bank }],
  });
  const info = await cli(dir, ["info"], env);
  expect(info.out).toContain("wiki");
  expect(info.out).toContain("ask #skills");
  const denied = await cli(dir, ["add", "vault", "-y"], env);
  expect(denied.code).toBe(1);
  expect(denied.out).toContain("denied by policy");
  const config = {
    version: 1,
    sources: [{ repo: bank, type: "local" }],
    policy: { denyFrontmatter: [] },
  };
  await writeFile(join(dir, "zkills.config.json"), JSON.stringify(config));
  expect((await cli(dir, ["add", "vault", "-y"], env)).out).toContain("denied by policy");
  expect((await cli(dir, ["init", "-y"])).out).toContain("keeping it");
  await cleanup(dir);
});
