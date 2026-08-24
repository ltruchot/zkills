import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";
import { stableJson } from "../../src/core/lock/sort.ts";
import { tmpDir } from "./tmp.ts";

const CLI = join(import.meta.dirname, "../../src/cli.ts");
export const FIXTURES = join(import.meta.dirname, "../fixtures");

export type Run = { code: number; out: string };

// Run the real CLI from source with type stripping
export async function cli(
  cwd: string,
  args: string[],
  env: Record<string, string> = {},
): Promise<Run> {
  const res = await execa("node", [CLI, ...args], {
    cwd,
    env: { ...process.env, ...env },
    reject: false,
    all: true,
  });
  return { code: res.exitCode ?? 1, out: res.all ?? "" };
}

// Temp project pointing at a local fixture bank
export async function project(bank: string): Promise<string> {
  const dir = await tmpDir("zkills-e2e-");
  await mkdir(join(dir, ".git"));
  await setBank(dir, bank);
  return dir;
}

export async function setBank(dir: string, bank: string): Promise<void> {
  const config = { version: 1, sources: [{ repo: join(FIXTURES, bank), type: "local" }] };
  await writeFile(join(dir, "zkills.config.json"), stableJson(config));
}
