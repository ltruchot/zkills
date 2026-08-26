import { join } from "node:path";
import { execa } from "execa";
import { expect, test } from "vite-plus/test";
import { VERSION } from "../../src/version.ts";

const CLI = join(import.meta.dirname, "../../src/cli.ts");

test("real process: version, help, unknown command exit code", async () => {
  const version = await execa("node", [CLI, "--version"]);
  expect(version.stdout).toContain(VERSION);
  const help = await execa("node", [CLI, "--help"]);
  expect(help.stdout).toContain("add [...names]");
  const missing = await execa("node", [CLI, "check", "--cwd", "/nonexistent"], { reject: false });
  expect(missing.exitCode).toBe(1);
  expect(missing.stderr).toContain("run init first");
});
