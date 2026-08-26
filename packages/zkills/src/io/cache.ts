import { homedir } from "node:os";
import { join } from "node:path";

// ~/.cache/zkills or $XDG_CACHE_HOME/zkills
export function cacheRoot(env: Record<string, string | undefined> = process.env): string {
  const base = env["XDG_CACHE_HOME"] ?? join(homedir(), ".cache");
  return join(base, "zkills");
}

// One dir per host, owner, name and sha; inputs validated by the config schema
export function cachePath(
  host: string,
  repo: string,
  sha: string,
  env?: Record<string, string | undefined>,
): string {
  const safe = (s: string): string => s.replaceAll(/[^\w.-]/g, "_");
  return join(cacheRoot(env), "github", safe(host), ...repo.split("/").map(safe), sha);
}
