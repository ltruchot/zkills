import type { Source } from "../core/schema/config.ts";
import { fetchGithub } from "./source-github.ts";
import { fetchLocal, type Resolved } from "./source-local.ts";

// Resolve a config source to a bank dir, optionally at a known sha
export function resolveSource(
  src: Source,
  token: string | null,
  root: string,
  sha?: string,
): Promise<Resolved> {
  if (src.type === "local") return fetchLocal(src.repo, src.path, root);
  return fetchGithub(src, token, sha);
}

export function sourceLabel(src: Source): string {
  return src.type === "local" ? src.repo : `${src.repo}@${src.ref}`;
}
