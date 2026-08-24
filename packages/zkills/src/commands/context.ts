import type { Config } from "../core/schema/config.ts";
import type { LocalFile } from "../core/schema/local.ts";
import type { LockFile } from "../core/schema/lock.ts";
import { resolveToken } from "../io/auth.ts";
import { loadConfig } from "../io/config.ts";
import { readLocal } from "../io/local.ts";
import { readLock } from "../io/lock.ts";
import { findRoot, type Paths, paths } from "../io/paths.ts";

export type GlobalOpts = { cwd?: string; yes?: boolean; json?: boolean };

export type Ctx = {
  p: Paths;
  config: Config;
  lock: LockFile;
  local: LocalFile;
  yes: boolean;
  json: boolean;
  token: () => Promise<string | null>;
};

// Load config, lock, secrets, lazy token
export async function loadContext(opts: GlobalOpts): Promise<Ctx> {
  const p = paths(findRoot(opts.cwd ?? process.cwd()));
  let cached: Promise<string | null> | undefined;
  return {
    p,
    config: await loadConfig(p),
    lock: await readLock(p),
    local: await readLocal(p),
    yes: opts.yes === true,
    json: opts.json === true,
    token: () => (cached ??= resolveToken()),
  };
}
