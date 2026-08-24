import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { main } from "../../src/app.ts";
import { stableJson } from "../../src/core/lock/sort.ts";
import { capture } from "./capture.ts";
import { tmpDir } from "./tmp.ts";

export const FIXTURES = join(import.meta.dirname, "../fixtures");

export type Run = { code: number; out: string };

// Run the CLI in-process with captured output and scoped env
export async function cli(
  cwd: string,
  args: string[],
  env: Record<string, string> = {},
): Promise<Run> {
  const run = await capture(env, () => main(["node", "zkills", ...args, "--cwd", cwd]));
  return { code: run.value, out: run.out };
}

// Temp project pointing at a local fixture bank
export async function project(bank: string): Promise<string> {
  const dir = await tmpDir("zkills-e2e-");
  await mkdir(join(dir, ".git"));
  await setBank(dir, bank);
  return dir;
}

export async function setBank(
  dir: string,
  bank: string,
  extra: Record<string, unknown> = {},
): Promise<void> {
  const config = { version: 1, sources: [{ repo: join(FIXTURES, bank), type: "local" }], ...extra };
  await writeFile(join(dir, "zkills.config.json"), stableJson(config));
}
