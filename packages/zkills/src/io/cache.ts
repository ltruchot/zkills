import { homedir } from "node:os";
import { join } from "node:path";

// ~/.cache/zkills or $XDG_CACHE_HOME/zkills
export function cacheRoot(env: Record<string, string | undefined> = process.env): string {
  const base = env.XDG_CACHE_HOME ?? join(homedir(), ".cache");
  return join(base, "zkills");
}

// One dir per repo@sha, safe path segments
export function cachePath(
  repo: string,
  sha: string,
  env?: Record<string, string | undefined>,
): string {
  const safe = repo.replace(/[^\w.-]/g, "_");
  return join(cacheRoot(env), "github", safe, sha);
}
