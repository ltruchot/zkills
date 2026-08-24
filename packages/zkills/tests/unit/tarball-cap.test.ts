import { expect, test, vi } from "vite-plus/test";
import { fetchTarball, MAX_TARBALL } from "../../src/io/gh-api.ts";

test("tarball over the size cap is refused", async () => {
  const big = new Uint8Array(MAX_TARBALL + 1);
  vi.stubGlobal(
    "fetch",
    vi.fn<() => Promise<Response>>(() => Promise.resolve(new Response(big))),
  );
  await expect(fetchTarball("https://api.github.com", "o/r", "a".repeat(40), null)).rejects.toThrow(
    /over/,
  );
  vi.unstubAllGlobals();
});
