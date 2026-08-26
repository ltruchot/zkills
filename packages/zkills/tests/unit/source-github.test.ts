import { expect, test, vi } from "vite-plus/test";
import { JSON_ACCEPT } from "../../src/io/gh-api.ts";
import { fetchGithub } from "../../src/io/source-github.ts";
import { fakeBankTarball } from "../helpers/tarball.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

const SHA = "b".repeat(40);

test("fetchGithub downloads once, extracts subdir, then serves cache even offline", async () => {
  const cache = await tmpDir("zkills-net-");
  vi.stubEnv("XDG_CACHE_HOME", cache);
  const gz = await fakeBankTarball();
  // GitHub answers 415 to an Accept it does not know, mock behaves the same
  const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>((url, init) => {
    const accept = (init.headers as Record<string, string>)["Accept"] ?? "";
    if (!accept.startsWith("application/vnd.github"))
      return Promise.resolve(new Response("unsupported Accept", { status: 415 }));
    return Promise.resolve(url.includes("/tarball/") ? new Response(gz) : new Response(SHA));
  });
  vi.stubGlobal("fetch", fetchMock);
  const src = { repo: "o/r", ref: "main", path: "skills", host: "github.com" };
  const first = await fetchGithub(src, "tok");
  expect(first.sha).toBe(SHA);
  expect(first.dir).toContain(`github.com/o/r/${SHA}`);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[1]?.[0]).toBe(`https://api.github.com/repos/o/r/tarball/${SHA}`);
  expect(fetchMock.mock.calls[1]?.[1].headers).toStrictEqual({
    Accept: JSON_ACCEPT,
    Authorization: "Bearer tok",
  });
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
