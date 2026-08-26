import { cac, type CAC } from "cac";
import { registerAll } from "./commands/index.ts";
import { getPreset, resolvePreset, setPreset } from "./commands/preset-store.ts";
import { isZkillsError } from "./core/errors.ts";
import type { Preset } from "./core/schema/preset.ts";
import { printErr } from "./io/ui.ts";
import { VERSION } from "./version.ts";

export function createCli(): CAC {
  const cli = cac(getPreset().name);
  cli.option("--cwd <dir>", "Project dir, default cwd");
  cli.option("-y, --yes", "Skip prompts, fail on missing answers");
  cli.option("--json", "Machine output where supported");
  cli.option("--dry-run", "Plan and preview, write nothing");
  registerAll(cli);
  cli.help();
  cli.version(VERSION);
  return cli;
}

// Parse argv, apply preset, run command, map errors to exit codes
export async function main(argv: string[], preset?: Partial<Preset>): Promise<number> {
  try {
    setPreset(await resolvePreset(preset));
    const cli = createCli();
    cli.parse(argv, { run: false });
    const result: unknown = await cli.runMatchedCommand();
    return typeof result === "number" ? result : 0;
  } catch (error) {
    if (isZkillsError(error)) {
      printErr(`error: ${error.message}`);
      return error.code;
    }
    printErr(`error: ${(error as Error).message}`);
    return 1;
  }
}
