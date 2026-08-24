import { expect, test, vi } from "vite-plus/test";
import { fetchGithub } from "../../src/io/source-github.ts";
import { fakeBankTarball } from "../helpers/tarball.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

const SHA = "b".repeat(40);

test("fetchGithub downloads once, extracts subdir, then serves cache even offline", async () => {
  const cache = await tmpDir("zkills-net-");
  vi.stubEnv("XDG_CACHE_HOME", cache);
  const gz = await fakeBankTarball();
  const fetchMock = vi.fn<(url: string) => Promise<Response>>((url) =>
    Promise.resolve(url.includes("/tarball/") ? new Response(gz) : new Response(SHA)),
  );
  vi.stubGlobal("fetch", fetchMock);
  const src = { repo: "o/r", ref: "main", path: "skills", host: "github.com" };
  const first = await fetchGithub(src, "tok");
  expect(first.sha).toBe(SHA);
  expect(first.dir).toContain(`o_r/${SHA}`);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[1]?.[0]).toBe(`https://api.github.com/repos/o/r/tarball/${SHA}`);
  const { readTree } = await import("../../src/io/fs.ts");
  expect([...(await readTree(first.dir)).keys()]).toStrictEqual([
    "hello/SKILL.md",
    "hello/scripts/run.sh",
  ]);
  vi.stubEnv("ZKILLS_OFFLINE", "1");
  expect((await fetchGithub(src, null, SHA)).dir).toBe(first.dir);
  await expect(fetchGithub({ ...src, ref: "dev" }, null)).rejects.toThrow(/offline/);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  await cleanup(cache);
});
