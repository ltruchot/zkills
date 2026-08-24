// Fail when any tracked text file exceeds 50 lines
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const MAX = 50;
const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", "dist", "coverage", ".vite-hooks", ".cache"]);
const SKIP_FILES = new Set(["pnpm-lock.yaml", "LICENSE.md"]);
const TEXT = /\.(ts|js|mjs|json|yaml|yml|md|txt|sh|gitignore|gitattributes)$/;

function walk(dir: string, out: string[]): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full, out);
    } else if (!SKIP_FILES.has(name) && (TEXT.test(name) || name.startsWith("."))) {
      out.push(full);
    }
  }
  return out;
}

function count(file: string): number {
  const text = readFileSync(file, "utf8");
  return text.endsWith("\n") ? text.split("\n").length - 1 : text.split("\n").length;
}

const long = walk(ROOT, [])
  .map((f) => ({ file: relative(ROOT, f), lines: count(f) }))
  .filter((e) => e.lines > MAX);

for (const e of long) console.error(`${e.file}: ${e.lines} lines (max ${MAX})`);
if (long.length > 0) process.exit(1);
console.log("lines: ok");
