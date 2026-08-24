import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { z } from "zod";
import { stableJson } from "../core/lock/sort.ts";
import { exists } from "./fs.ts";

// Read + validate JSON, fallback when file absent
export async function readJson<T>(
  file: string,
  schema: z.ZodType<T>,
  fallback: () => T,
): Promise<T> {
  if (!(await exists(file))) return fallback();
  const raw: unknown = JSON.parse(await readFile(file, "utf8"));
  const result = schema.safeParse(raw);
  if (!result.success) throw new Error(`invalid ${file}: ${result.error.message}`);
  return result.data;
}

export async function writeJson(file: string, value: unknown, mode = 0o644): Promise<void> {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, stableJson(value), { mode });
}
