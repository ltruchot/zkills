import { expect, test, vi } from "vite-plus/test";
import { resolveSha } from "../../src/io/gh-api.ts";

const SHA = "b".repeat(40);
const respond = (body: string, status = 200): (() => Promise<Response>) =>
  vi.fn<() => Promise<Response>>(() => Promise.resolve(new Response(body, { status })));

test("resolveSha: passthrough, api call with bearer, errors", async () => {
  const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(() =>
    Promise.resolve(new Response(SHA)),
  );
  vi.stubGlobal("fetch", fetchMock);
  expect(await resolveSha("o/r", SHA, null)).toBe(SHA);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(await resolveSha("o/r", "main", "tok")).toBe(SHA);
  const [url, init] = fetchMock.mock.calls[0] ?? ["", {}];
  expect(url).toBe("https://api.github.com/repos/o/r/commits/main");
  expect((init.headers as Record<string, string>)["Authorization"]).toBe("Bearer tok");
  vi.stubGlobal("fetch", respond("nope", 404));
  await expect(resolveSha("o/r", "main", null)).rejects.toThrow(/404/);
  vi.stubGlobal("fetch", respond("garbage"));
  await expect(resolveSha("o/r", "main", null)).rejects.toThrow(/bad sha/);
  vi.unstubAllGlobals();
});
