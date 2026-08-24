import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { readLocalFile, readLockFile } from "../helpers/json.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

const env = { ZKILLS_ANSWER_VAULT_URL: "https://vault.test", ZKILLS_ANSWER_TOKEN: "s3cret" };

test("secrets stay out of lock, skill dir gitignored, restore and remove clean up", async () => {
  const dir = await project("bank-secret");
  const cache = { XDG_CACHE_HOME: await tmpDir("zkills-cache-") };
  const skill = join(dir, ".claude/skills/vault/SKILL.md");
  const local = join(dir, ".claude/zkills.local.json");
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  expect((await cli(dir, ["add", "vault", "-y"], { ...env, ...cache })).code).toBe(0);
  expect(await readFile(skill, "utf8")).toContain("Token: s3cret");
  expect(await readFile(skill, "utf8")).toContain("Verbose: false");
  const entry = (await readLockFile(join(dir, ".claude/zkills.lock.json"))).skills["vault"];
  expect(entry?.answers).toStrictEqual({ VAULT_URL: "https://vault.test", VERBOSE: "false" });
  expect(entry?.secrets).toStrictEqual(["TOKEN"]);
  expect((await readLocalFile(local)).secrets["vault"]).toStrictEqual({ TOKEN: "s3cret" });
  expect(await readFile(join(dir, ".claude/.gitignore"), "utf8")).toContain("skills/vault/");
  expect((await cli(dir, ["answers", "vault"])).out).toContain("TOKEN = ");
  expect((await cli(dir, ["answers", "vault"])).out).not.toContain("s3cret");

  await rm(join(dir, ".claude/skills/vault"), { recursive: true });
  expect((await cli(dir, ["check", "--offline"])).code).toBe(2);
  expect((await cli(dir, ["add", "-y"], cache)).code).toBe(0);
  expect(await readFile(skill, "utf8")).toContain("Token: s3cret");

  await setBank(dir, "bank-secret-v2");
  expect((await cli(dir, ["update", "-y"], cache)).code).toBe(0);
  expect(await readFile(join(dir, ".claude/skills/vault/notes.md"), "utf8")).toBe(
    "- local notes v1\n",
  );
  expect(await readFile(skill, "utf8")).toContain("Extra line v2");

  expect((await cli(dir, ["remove", "vault", "-y"])).code).toBe(0);
  expect(await readFile(join(dir, ".claude/.gitignore"), "utf8")).not.toContain("skills/vault/");
  expect((await readLocalFile(local)).secrets).toStrictEqual({});
  await cleanup(dir);
  await cleanup(cache.XDG_CACHE_HOME);
});
