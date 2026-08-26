import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { readLockFile } from "../helpers/json.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

const env = { ZKILLS_ANSWER_VAULT_URL: "https://v.test", ZKILLS_ANSWER_TOKEN: "t" };

test("policy blocks sources and frontmatter keys", async () => {
  const dir = await project("bank-secret");
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  await setBank(dir, "bank-secret", { policy: { allowedSources: ["acme/skills"] } });
  const blocked = await cli(dir, ["add", "vault", "-y"], env);
  expect(blocked.code).toBe(1);
  expect(blocked.out).toContain("allowedSources");
  await setBank(dir, "bank-secret", { policy: { denyFrontmatter: ["allowed-tools"] } });
  expect((await cli(dir, ["add", "vault", "-y"], env)).out).toContain("denied by policy");
  expect((await cli(dir, ["add", "nope", "-y"], env)).out).toContain("unknown skill");
  await cleanup(dir);
});

test("frozen check detects tampered lock, base fallback without cache", async () => {
  const dir = await project("bank-v1");
  const cacheA = { XDG_CACHE_HOME: await tmpDir("zkills-a-") };
  const answers = { ZKILLS_ANSWER_PROJECT_NAME: "Acme" };
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  expect((await cli(dir, ["add", "hello", "-y"], { ...answers, ...cacheA })).code).toBe(0);
  expect((await cli(dir, ["check", "--frozen"])).code).toBe(0);
  const lockPath = join(dir, ".claude/zkills.lock.json");
  const lock = await readLockFile(lockPath);
  const hello = lock.skills["hello"];
  if (hello !== undefined) hello.answers["PROJECT_NAME"] = "Tampered";
  await writeFile(lockPath, JSON.stringify(lock));
  expect((await cli(dir, ["check", "--frozen"])).code).toBe(3);
  await setBank(dir, "bank-v2");
  expect((await cli(dir, ["check", "--frozen"])).out).toContain("installed outside");
  const cacheB = { XDG_CACHE_HOME: await tmpDir("zkills-b-") };
  await writeFile(join(dir, ".claude/skills/hello/SKILL.md"), "totally mine\n");
  const up = await cli(dir, ["update", "-y"], {
    ...answers,
    ZKILLS_ANSWER_TEAM: "core",
    ...cacheB,
  });
  expect(up.out).toContain("base template unavailable");
  expect(up.out).toContain("resolve conflicts");
  await cleanup(dir);
});
