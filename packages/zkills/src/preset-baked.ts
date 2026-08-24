import { type Preset, Preset as PresetSchema } from "./core/schema/preset.ts";

// Injected by the build from flavor/preset.json, absent in the white-label build
declare const __ZKILLS_PRESET__: string | undefined;

export function bakedPreset(): Preset | undefined {
  if (typeof __ZKILLS_PRESET__ !== "string") return undefined;
  return PresetSchema.parse(JSON.parse(__ZKILLS_PRESET__));
}
