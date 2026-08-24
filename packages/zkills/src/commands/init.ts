import { mkdir } from "node:fs/promises";
import * as p from "@clack/prompts";
import type { CAC } from "cac";
import { defaultConfig } from "../core/schema/config.ts";
import { LOCAL_FILE } from "../core/schema/local.ts";
import { emptyLock } from "../core/schema/lock.ts";
import { saveConfig } from "../io/config.ts";
import { exists } from "../io/fs.ts";
import { ensureLines } from "../io/gitignore.ts";
import { writeLock } from "../io/lock.ts";
import { findRoot, paths } from "../io/paths.ts";
import { info, intro, note, outro } from "../io/ui.ts";
import type { GlobalOpts } from "./context.ts";

export const DEFAULT_BANK = "Gods-Academy/skills";

async function askRepo(yes: boolean): Promise<string> {
  if (yes) return DEFAULT_BANK;
  const value = await p.text({ message: "Bank repo (owner/name)", initialValue: DEFAULT_BANK });
  if (p.isCancel(value)) process.exit(130);
  return value;
}

// Config, lock, secrets gitignore, skills dir
export async function runInit(repo: string | undefined, opts: GlobalOpts): Promise<void> {
  intro("zkills init");
  const paths_ = paths(findRoot(opts.cwd ?? process.cwd()));
  if (await exists(paths_.config)) info(`${paths_.config} exists, keeping it`);
  else await saveConfig(paths_, defaultConfig(repo ?? (await askRepo(opts.yes === true))));
  const hadSkills = await exists(paths_.skills);
  await mkdir(paths_.skills, { recursive: true });
  await ensureLines(paths_.claudeGitignore, [LOCAL_FILE]);
  if (!(await exists(paths_.lock))) await writeLock(paths_, emptyLock());
  if (!hadSkills)
    note(["restart Claude Code once", "new .claude/skills dir loads at startup only"], "note");
  outro(`ready: zkills add <skill>`);
}

export function register(cli: CAC): void {
  cli.command("init [repo]", "Create zkills.config.json and lock").action(runInit);
}
