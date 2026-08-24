import { mkdir } from "node:fs/promises";
import type { downloadTemplate as Download, DownloadTemplateResult } from "giget";
import { expect, test, vi } from "vite-plus/test";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

vi.mock(import("giget"), () => ({
  downloadTemplate: vi.fn<typeof Download>(async (_src, opts) => {
    const dir = opts?.dir ?? "";
    await mkdir(dir, { recursive: true });
    return { dir } as unknown as DownloadTemplateResult;
  }),
}));

const SHA = "b".repeat(40);

test("fetchGithub downloads once then hits cache", async () => {
  const cache = await tmpDir("zkills-net-");
  vi.stubEnv("XDG_CACHE_HOME", cache);
  vi.stubGlobal(
    "fetch",
    vi.fn<() => Promise<Response>>(() => Promise.resolve(new Response(SHA))),
  );
  const { fetchGithub } = await import("../../src/io/source-github.ts");
  const { downloadTemplate } = await import("giget");
  const src = { repo: "o/r", ref: "main", path: "skills" };
  const first = await fetchGithub(src, "tok");
  expect(first.sha).toBe(SHA);
  expect(first.dir).toContain(`o_r/${SHA}`);
  expect(downloadTemplate).toHaveBeenCalledTimes(1);
  expect(downloadTemplate).toHaveBeenCalledWith(
    `gh:o/r/skills#${SHA}`,
    expect.objectContaining({ auth: "tok" }),
  );
  await fetchGithub(src, null, SHA);
  expect(downloadTemplate).toHaveBeenCalledTimes(1);
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  await cleanup(cache);
});
