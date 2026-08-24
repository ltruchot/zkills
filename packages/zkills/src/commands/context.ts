import { mergePolicy } from "../core/policy-merge.ts";
import type { Config, ConflictMode, Policy } from "../core/schema/config.ts";
import type { LocalFile } from "../core/schema/local.ts";
import type { LockFile } from "../core/schema/lock.ts";
import type { Preset } from "../core/schema/preset.ts";
import { resolveToken } from "../io/auth.ts";
import { loadConfig } from "../io/config.ts";
import { readLocal } from "../io/local.ts";
import { readLock } from "../io/lock.ts";
import { findRoot, type Paths, paths } from "../io/paths.ts";
import { getPreset } from "./preset-store.ts";

export type GlobalOpts = { cwd?: string; yes?: boolean; json?: boolean; dryRun?: boolean };

export type Ctx = {
  p: Paths;
  config: Config;
  preset: Preset;
  policy: Policy | undefined;
  conflict: ConflictMode;
  lock: LockFile;
  local: LocalFile;
  yes: boolean;
  json: boolean;
  dryRun: boolean;
  token: () => Promise<string | null>;
};

// Load config, lock, secrets, preset rules, lazy token
export async function loadContext(opts: GlobalOpts): Promise<Ctx> {
  const p = paths(findRoot(opts.cwd ?? process.cwd()));
  const preset = getPreset();
  const config = await loadConfig(p);
  let cached: Promise<string | null> | undefined;
  return {
    p,
    config,
    preset,
    policy: mergePolicy(preset.policy, config.policy),
    conflict: config.conflict ?? preset.conflict ?? "inline",
    lock: await readLock(p),
    local: await readLocal(p),
    yes: opts.yes === true,
    json: opts.json === true,
    dryRun: opts.dryRun === true,
    token: () => (cached ??= resolveToken()),
  };
}
