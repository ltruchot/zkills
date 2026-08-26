import { cachePath } from "./cache.ts";
import { exists, writeTree } from "./fs.ts";
import { fetchTarball, resolveSha } from "./gh-api.ts";
import { apiUrl } from "./net.ts";
import type { Resolved } from "./source-local.ts";
import { readTarGz } from "./tar.ts";

export type GithubSource = { repo: string; ref: string; path: string; host: string };

// Bank subdir at an immutable sha, cached per repo@sha, offline when cached
export async function fetchGithub(
  src: GithubSource,
  token: string | null,
  sha?: string,
): Promise<Resolved> {
  const api = apiUrl(src.host);
  const pinned = sha ?? (await resolveSha(api, src.repo, src.ref, token));
  const dir = cachePath(src.host, src.repo, pinned);
  if (await exists(dir)) return { dir, sha: pinned };
  const files = readTarGz(await fetchTarball(api, src.repo, pinned, token), src.path);
  if (files.size === 0)
    throw new Error(`no files under ${src.path} in ${src.repo}@${pinned.slice(0, 7)}`);
  await writeTree(dir, files);
  return { dir, sha: pinned };
}
