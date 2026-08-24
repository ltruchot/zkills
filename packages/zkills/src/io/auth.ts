import { execa } from "execa";

export const TOKEN_VARS = ["ZKILLS_TOKEN", "GH_TOKEN", "GITHUB_TOKEN"] as const;

export type Env = Record<string, string | undefined>;

async function ghToken(): Promise<string | null> {
  try {
    const { stdout } = await execa("gh", ["auth", "token"]);
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

// ZKILLS_TOKEN → GH_TOKEN → GITHUB_TOKEN → gh auth token
export function resolveToken(env: Env = process.env, fallback = ghToken): Promise<string | null> {
  for (const name of TOKEN_VARS) {
    const value = env[name];
    if (value !== undefined && value.length > 0) return Promise.resolve(value);
  }
  return fallback();
}
