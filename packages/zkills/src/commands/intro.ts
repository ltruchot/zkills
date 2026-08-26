import { intro } from "../io/ui.ts";
import { getPreset } from "./preset-store.ts";

// Flavor name in every intro and hint, e.g. "acme-skills add"
export function tool(): string {
  return getPreset().name;
}

export function cmdIntro(cmd: string): void {
  intro(`${tool()} ${cmd}`);
}
