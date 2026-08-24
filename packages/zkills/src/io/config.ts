import { Config } from "../core/schema/config.ts";
import { readJson, writeJson } from "./json.ts";
import type { Paths } from "./paths.ts";

export async function loadConfig(p: Paths): Promise<Config> {
  return readJson(p.config, Config, () => {
    throw new Error(`missing ${p.config}, run zkills init`);
  });
}

export async function saveConfig(p: Paths, config: Config): Promise<void> {
  await writeJson(p.config, config);
}
