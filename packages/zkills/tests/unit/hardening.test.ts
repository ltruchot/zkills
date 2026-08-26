import { expect, test } from "vite-plus/test";
import { isTrustedHost, trustedHosts } from "../../src/core/hosts.ts";
import { Source } from "../../src/core/schema/config.ts";
import { Preset } from "../../src/core/schema/preset.ts";
import { cachePath } from "../../src/io/cache.ts";

test("token follows github.com, preset hosts and ZKILLS_HOSTS only", () => {
  const preset = Preset.parse({ sources: [{ repo: "acme/skills", host: "ghe.acme.internal" }] });
  expect([...trustedHosts(preset, {})]).toStrictEqual(["github.com", "ghe.acme.internal"]);
  expect(isTrustedHost("evil.example", preset, {})).toBe(false);
  expect(isTrustedHost("evil.example", preset, { ZKILLS_HOSTS: " ghe.corp, evil.example " })).toBe(
    true,
  );
  expect(isTrustedHost("ghe.corp", Preset.parse({}), {})).toBe(false);
  expect(isTrustedHost("github.com", Preset.parse({}), {})).toBe(true);
});

test("source schema pins repo to owner/name and host to a hostname", () => {
  expect(Source.safeParse({ repo: "acme/skills" }).success).toBe(true);
  expect(Source.safeParse({ repo: "acme/skills/../x" }).success).toBe(false);
  expect(Source.safeParse({ repo: "../x" }).success).toBe(false);
  expect(Source.safeParse({ repo: "acme/.." }).success).toBe(false);
  expect(Source.safeParse({ repo: "../bank", type: "local" }).success).toBe(true);
  expect(Source.safeParse({ repo: "a/b", host: "ghe.corp:8443" }).success).toBe(true);
  expect(Source.safeParse({ repo: "a/b", host: "evil.example/api?x=" }).success).toBe(false);
  expect(Source.safeParse({ repo: "a/b", host: ".." }).success).toBe(false);
  expect(Source.safeParse({ repo: "a/b", host: "Evil.Example" }).success).toBe(false);
});

test("cache path separates hosts and never collides on sanitized names", () => {
  const env = { XDG_CACHE_HOME: "/c" };
  expect(cachePath("ghe.corp:8443", "o/r", "s", env)).toBe("/c/zkills/github/ghe.corp_8443/o/r/s");
  expect(cachePath("github.com", "a/b", "s", env)).not.toBe(cachePath("ghe.corp", "a/b", "s", env));
});
