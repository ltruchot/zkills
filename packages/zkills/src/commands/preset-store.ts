import { readFile } from "node:fs/promises";
import { emptyPreset, Preset } from "../core/schema/preset.ts";
import { bakedPreset } from "../preset-baked.ts";

let current: Preset = emptyPreset();

export function setPreset(preset: Preset): void {
  current = preset;
}

export function getPreset(): Preset {
  return current;
}

// Explicit → baked at build → ZKILLS_PRESET file → empty
export async function resolvePreset(
  explicit: Partial<Preset> | undefined,
  env: Record<string, string | undefined> = process.env,
  baked: () => Preset | undefined = bakedPreset,
): Promise<Preset> {
  if (explicit !== undefined) return Preset.parse(explicit);
  const built = baked();
  if (built !== undefined) return built;
  const file = env["ZKILLS_PRESET"];
  if (file === undefined || file.length === 0) return emptyPreset();
  return Preset.parse(JSON.parse(await readFile(file, "utf8")));
}
