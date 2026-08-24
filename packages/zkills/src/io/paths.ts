import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { CONFIG_FILE } from "../core/schema/config.ts";
import { LOCAL_FILE } from "../core/schema/local.ts";

export const LOCK_FILE = "zkills.lock.json";
export const CLAUDE_DIR = ".claude";
export const SKILLS_DIR = "skills";

export type Paths = {
  root: string;
  config: string;
  claude: string;
  skills: string;
  lock: string;
  local: string;
  claudeGitignore: string;
};

// Walk up until zkills.config.json or .git, else cwd
export function findRoot(cwd: string): string {
  let dir = cwd;
  for (;;) {
    if (existsSync(join(dir, CONFIG_FILE)) || existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return cwd;
    dir = parent;
  }
}

export function paths(root: string): Paths {
  const claude = join(root, CLAUDE_DIR);
  return {
    root,
    config: join(root, CONFIG_FILE),
    claude,
    skills: join(claude, SKILLS_DIR),
    lock: join(claude, LOCK_FILE),
    local: join(claude, LOCAL_FILE),
    claudeGitignore: join(claude, ".gitignore"),
  };
}

export function skillDir(p: Paths, name: string): string {
  return join(p.skills, name);
}
