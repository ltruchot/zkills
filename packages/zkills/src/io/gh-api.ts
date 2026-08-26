import { SHA40 } from "../core/schema/lock.ts";
import { assertOnline } from "./net.ts";

export const isSha = (ref: string): boolean => SHA40.test(ref);

function headers(token: string | null, accept: string): Record<string, string> {
  const out: Record<string, string> = { Accept: accept };
  if (token !== null) out["Authorization"] = `Bearer ${token}`;
  return out;
}

// Commit sha for a branch, tag or sha, on github.com or GitHub Enterprise
export async function resolveSha(
  api: string,
  repo: string,
  ref: string,
  token: string | null,
): Promise<string> {
  if (isSha(ref)) return ref;
  assertOnline("resolving a git ref");
  const res = await fetch(`${api}/repos/${repo}/commits/${encodeURIComponent(ref)}`, {
    headers: headers(token, "application/vnd.github.sha"),
  });
  if (!res.ok) throw new Error(`github ${res.status} for ${repo}@${ref}`);
  const sha = (await res.text()).trim();
  if (!isSha(sha)) throw new Error(`bad sha from github: ${sha}`);
  return sha;
}

export const MAX_TARBALL = 50 * 1024 * 1024;
// GitHub answers 415 to an unknown Accept, octet-stream included
export const JSON_ACCEPT = "application/vnd.github+json";

// Repo tarball at a sha, codeload redirect followed, capped at 50 MiB
export async function fetchTarball(
  api: string,
  repo: string,
  sha: string,
  token: string | null,
): Promise<Buffer> {
  assertOnline("downloading a bank");
  const res = await fetch(`${api}/repos/${repo}/tarball/${sha}`, {
    headers: headers(token, JSON_ACCEPT),
  });
  if (!res.ok) throw new Error(`github ${res.status} downloading ${repo}@${sha.slice(0, 7)}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length > MAX_TARBALL) throw new Error(`tarball over ${MAX_TARBALL} bytes`);
  return bytes;
}
