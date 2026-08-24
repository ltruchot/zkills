import { mkdir } from "node:fs/promises";
import { isCancel, text } from "@clack/prompts";
import type { CAC } from "cac";
import { Config, defaultConfig } from "../core/schema/config.ts";
import { LOCAL_FILE } from "../core/schema/local.ts";
import { emptyLock } from "../core/schema/lock.ts";
import { saveConfig } from "../io/config.ts";
import { exists } from "../io/fs.ts";
import { ensureLines } from "../io/gitignore.ts";
import { writeLock } from "../io/lock.ts";
import { findRoot, paths } from "../io/paths.ts";
import { cancelled } from "../io/prompts/confirm.ts";
import { fail, info, intro, note, outro } from "../io/ui.ts";
import type { GlobalOpts } from "./context.ts";
import { getPreset } from "./preset-store.ts";

// Arg → preset sources → prompt, never a built-in default
async function pickConfig(repo: string | undefined, yes: boolean): Promise<Config> {
  if (repo !== undefined) return defaultConfig(repo);
  const preset = getPreset().sources;
  if (preset !== undefined) return Config.parse({ version: 1, sources: preset });
  if (yes) fail("name the bank repo: zkills init owner/skills");
  const value = await text({ message: "Bank repo (owner/name)", placeholder: "my-org/skills" });
  if (isCancel(value)) cancelled();
  return defaultConfig(value);
}

// Config, lock, secrets gitignore, skills dir; idempotent
export async function runInit(repo: string | undefined, opts: GlobalOpts): Promise<void> {
  intro(`${getPreset().name} init`);
  const p = paths(findRoot(opts.cwd ?? process.cwd()));
  if (await exists(p.config)) info(`${p.config} exists, keeping it`);
  else await saveConfig(p, await pickConfig(repo, opts.yes === true));
  const hadSkills = await exists(p.skills);
  await mkdir(p.skills, { recursive: true });
  await ensureLines(p.claudeGitignore, [LOCAL_FILE]);
  if (!(await exists(p.lock))) await writeLock(p, emptyLock());
  if (!hadSkills)
    note(["restart Claude Code once", "new .claude/skills dir loads at startup only"], "note");
  outro("ready: zkills add <skill>");
}

export function register(cli: CAC): void {
  cli.command("init [repo]", "Create zkills.config.json and lock").action(runInit);
}
