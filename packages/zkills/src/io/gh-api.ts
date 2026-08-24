import { SHA40 } from "../core/schema/lock.ts";

const API = "https://api.github.com";

export function isSha(ref: string): boolean {
  return SHA40.test(ref);
}

// Commit sha for a branch, tag or sha
export async function resolveSha(repo: string, ref: string, token: string | null): Promise<string> {
  if (isSha(ref)) return ref;
  const headers: Record<string, string> = { Accept: "application/vnd.github.sha" };
  if (token !== null) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}/repos/${repo}/commits/${encodeURIComponent(ref)}`, { headers });
  if (!res.ok) throw new Error(`github ${res.status} for ${repo}@${ref}`);
  const sha = (await res.text()).trim();
  if (!isSha(sha)) throw new Error(`bad sha from github: ${sha}`);
  return sha;
}

export function tarballUrl(repo: string, sha: string): string {
  return `${API}/repos/${repo}/tarball/${sha}`;
}
