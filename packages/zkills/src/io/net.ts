import { ZkillsError } from "../core/errors.ts";

// ZKILLS_OFFLINE=1 forbids every network call, cache only
export function isOffline(env: Record<string, string | undefined> = process.env): boolean {
  const value = env["ZKILLS_OFFLINE"];
  return value !== undefined && value !== "" && value !== "0";
}

export function assertOnline(what: string): void {
  if (isOffline()) throw new ZkillsError(`offline mode, ${what} needs network`);
}

export function apiUrl(host: string): string {
  return host === "github.com" ? "https://api.github.com" : `https://${host}/api/v3`;
}
