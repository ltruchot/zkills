import type { Preset } from "./schema/preset.ts";

export const HOSTS_VAR = "ZKILLS_HOSTS";

// Token goes to github.com, preset bank hosts and ZKILLS_HOSTS only; project config never adds one
export function trustedHosts(
  preset: Preset,
  env: Record<string, string | undefined> = process.env,
): Set<string> {
  const out = new Set(["github.com"]);
  for (const source of preset.sources ?? []) out.add(source.host);
  for (const host of (env[HOSTS_VAR] ?? "").split(",")) {
    if (host.trim().length > 0) out.add(host.trim());
  }
  return out;
}

export function isTrustedHost(
  host: string,
  preset: Preset,
  env?: Record<string, string | undefined>,
): boolean {
  return trustedHosts(preset, env).has(host);
}
