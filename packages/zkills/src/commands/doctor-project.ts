import { homedir } from "node:os";
import { join } from "node:path";
import { managedNames, unmanagedDirs } from "../core/lock/managed.ts";
import { LOCAL_FILE } from "../core/schema/local.ts";
import type { Finding } from "../core/types.ts";
import { listDirs } from "../io/dirs.ts";
import { exists } from "../io/fs.ts";
import { isOffline } from "../io/net.ts";
import type { Ctx } from "./context.ts";
import { tool } from "./intro.ts";

export const finding = (rule: string, level: Finding["level"], msg: string): Finding => ({
  rule,
  level,
  msg,
});

// Project-level checks: token, gitignore, unmanaged dirs, shadowing
export async function projectChecks(ctx: Ctx): Promise<Finding[]> {
  const out: Finding[] = [];
  const github = ctx.config.sources.some((s) => s.type === "github");
  if (github && !isOffline() && (await ctx.token()) === null) {
    out.push(finding("token", "error", "no GitHub token, set GH_TOKEN or run gh auth login"));
  }
  if (isOffline()) out.push(finding("offline", "warn", "ZKILLS_OFFLINE set, cache only"));
  if (!(await exists(ctx.p.claudeGitignore))) {
    out.push(
      finding("gitignore", "error", `.claude/.gitignore missing, ${LOCAL_FILE} would be committed`),
    );
  }
  for (const dir of unmanagedDirs(ctx.lock, await listDirs(ctx.p.skills))) {
    out.push(finding("unmanaged", "warn", `${dir} is hand-written, ${tool()} never touches it`));
  }
  for (const name of managedNames(ctx.lock)) {
    if (await exists(join(homedir(), ".claude", "skills", name))) {
      out.push(finding("shadow", "warn", `~/.claude/skills/${name} overrides the project skill`));
    }
  }
  return out;
}
