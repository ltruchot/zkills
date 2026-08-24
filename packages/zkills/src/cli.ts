#!/usr/bin/env node
import { cac } from "cac";
import { registerAll } from "./commands/index.ts";
import { VERSION } from "./version.ts";

const cli = cac("zkills");

cli.option("--cwd <dir>", "Project dir, default cwd");
cli.option("-y, --yes", "Skip prompts, fail on missing answers");
cli.option("--json", "Machine output where supported");

registerAll(cli);

cli.help();
cli.version(VERSION);

try {
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
} catch (error) {
  console.error(`error: ${(error as Error).message}`);
  process.exit(1);
}
