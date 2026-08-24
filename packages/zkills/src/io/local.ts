import { emptyLocal, LocalFile } from "../core/schema/local.ts";
import type { Answers } from "../core/types.ts";
import { readJson, writeJson } from "./json.ts";
import type { Paths } from "./paths.ts";

export async function readLocal(p: Paths): Promise<LocalFile> {
  return readJson(p.local, LocalFile, emptyLocal);
}

// Secrets file is owner-only
export async function writeLocal(p: Paths, local: LocalFile): Promise<void> {
  await writeJson(p.local, local, 0o600);
}

export function secretsFor(local: LocalFile, skill: string): Answers {
  return local.secrets[skill] ?? {};
}

export function withSecrets(local: LocalFile, skill: string, secrets: Answers): LocalFile {
  const next = { ...local.secrets };
  if (Object.keys(secrets).length === 0) delete next[skill];
  else next[skill] = secrets;
  return { version: 1, secrets: next };
}
