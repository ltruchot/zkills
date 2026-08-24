import { expect, test, vi } from "vite-plus/test";
import { resolveSha } from "../../src/io/gh-api.ts";
import { apiUrl } from "../../src/io/net.ts";

const SHA = "b".repeat(40);
const API = "https://api.github.com";
const respond = (body: string, status = 200): (() => Promise<Response>) =>
  vi.fn<() => Promise<Response>>(() => Promise.resolve(new Response(body, { status })));

test("resolveSha: passthrough, api call with bearer, errors", async () => {
  const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(() =>
    Promise.resolve(new Response(SHA)),
  );
  vi.stubGlobal("fetch", fetchMock);
  expect(await resolveSha(API, "o/r", SHA, null)).toBe(SHA);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(await resolveSha(API, "o/r", "main", "tok")).toBe(SHA);
  const [url, init] = fetchMock.mock.calls[0] ?? ["", {}];
  expect(url).toBe("https://api.github.com/repos/o/r/commits/main");
  expect((init.headers as Record<string, string>)["Authorization"]).toBe("Bearer tok");
  vi.stubGlobal("fetch", respond("nope", 404));
  await expect(resolveSha(API, "o/r", "main", null)).rejects.toThrow(/404/);
  vi.stubGlobal("fetch", respond("garbage"));
  await expect(resolveSha(API, "o/r", "main", null)).rejects.toThrow(/bad sha/);
  vi.unstubAllGlobals();
});

test("enterprise host api url, offline refuses network", async () => {
  expect(apiUrl("github.com")).toBe("https://api.github.com");
  expect(apiUrl("github.acme.internal")).toBe("https://github.acme.internal/api/v3");
  vi.stubEnv("ZKILLS_OFFLINE", "1");
  await expect(resolveSha(API, "o/r", "main", null)).rejects.toThrow(/offline/);
  expect(await resolveSha(API, "o/r", SHA, null)).toBe(SHA);
  vi.unstubAllEnvs();
});
