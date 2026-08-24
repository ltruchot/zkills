// Build with the example flavor, run dist without node_modules, expect the baked preset
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();
const PRESET = join(ROOT, "flavor", "preset.json");
const owned = !existsSync(PRESET);
if (owned) copyFileSync(join(ROOT, "flavor", "preset.example.json"), PRESET);
const work = mkdtempSync(join(tmpdir(), "zkills-flavor-"));

try {
  execFileSync("vp", ["run", "-r", "build"], { cwd: ROOT, stdio: "ignore" });
  copyFileSync(join(ROOT, "packages", "zkills", "dist", "cli.js"), join(work, "cli.js"));
  writeFileSync(join(work, "zkills.config.json"), '{"version":1,"sources":[{"repo":"x/y"}]}');
  const out = execFileSync("node", ["cli.js", "info", "--json", "--cwd", work], {
    cwd: work,
    encoding: "utf8",
  });
  const info = JSON.parse(out) as { name: string; links: unknown[] };
  if (info.name !== "acme-skills" || info.links.length !== 2)
    throw new Error(`baked preset missing: ${out}`);
  console.log("flavorcheck: ok (dist runs alone, preset baked)");
} finally {
  rmSync(work, { recursive: true, force: true });
  if (owned) unlinkSync(PRESET);
  execFileSync("vp", ["run", "-r", "build"], { cwd: ROOT, stdio: "ignore" });
}
