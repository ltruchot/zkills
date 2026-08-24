import { downloadTemplate } from "giget";
import { cachePath } from "./cache.ts";
import { exists } from "./fs.ts";
import { resolveSha } from "./gh-api.ts";
import type { Resolved } from "./source-local.ts";

export type GithubSource = { repo: string; ref: string; path: string };

// Bank subdir at an immutable sha, cached per repo@sha
export async function fetchGithub(
  src: GithubSource,
  token: string | null,
  sha?: string,
): Promise<Resolved> {
  const pinned = sha ?? (await resolveSha(src.repo, src.ref, token));
  const dir = cachePath(src.repo, pinned);
  if (await exists(dir)) return { dir, sha: pinned };
  await downloadTemplate(`gh:${src.repo}/${src.path}#${pinned}`, {
    dir,
    force: true,
    ...(token === null ? {} : { auth: token }),
  });
  return { dir, sha: pinned };
}
