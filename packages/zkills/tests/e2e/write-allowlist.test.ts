import { readdir } from "node:fs/promises";
import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { changed, snapshotTree } from "../helpers/snapshot.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

const ALLOWED = /^(\.claude\/|zkills\.config\.json$)/;

test("every command writes only under .claude, the config and the cache", async () => {
  const dir = await project("bank-v1");
  const cache = await tmpDir("zkills-cache-");
  const env = {
    ZKILLS_ANSWER_PROJECT_NAME: "Acme",
    ZKILLS_ANSWER_TEAM: "web",
    XDG_CACHE_HOME: cache,
  };
  const before = await snapshotTree(dir);
  const flows = [["init", "-y"], ["add", "hello", "-y"], ["check"], ["doctor"], ["list"]];
  for (const args of flows) expect((await cli(dir, args, env)).code).toBe(0);
  await setBank(dir, "bank-v2");
  for (const args of [
    ["update", "-y"],
    ["repair", "-y"],
    ["repair", "hello", "--from-backup"],
    ["answers", "hello"],
    ["remove", "hello", "-y"],
  ]) {
    expect((await cli(dir, args, env)).code).toBe(0);
  }
  const touched = changed(before, await snapshotTree(dir));
  expect(touched.length).toBeGreaterThan(0);
  expect(touched.filter((p) => !ALLOWED.test(p))).toStrictEqual([]);
  expect(touched.some((p) => p.includes(".zk-work-"))).toBe(false);
  const cacheTop = await readdir(cache);
  expect(cacheTop).toStrictEqual(["zkills"]);
  await cleanup(dir);
  await cleanup(cache);
});
