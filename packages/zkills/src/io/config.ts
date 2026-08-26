import { Config } from "../core/schema/config.ts";
import { readJson, writeJson } from "./json.ts";
import type { Paths } from "./paths.ts";

export function loadConfig(p: Paths): Promise<Config> {
  return readJson(p.config, Config, () => {
    throw new Error(`missing ${p.config}, run init first`);
  });
}

export function saveConfig(p: Paths, config: Config): Promise<void> {
  return writeJson(p.config, config);
}
