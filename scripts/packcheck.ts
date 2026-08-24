// Fail when the packed manifest still holds pnpm protocols or lost its bin
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PKG = join(process.cwd(), "packages", "zkills");
const out = mkdtempSync(join(tmpdir(), "zkills-pack-"));

try {
  execFileSync("pnpm", ["pack", "--pack-destination", out], { cwd: PKG, stdio: "ignore" });
  const tgz = readdirSync(out).find((f) => f.endsWith(".tgz"));
  if (tgz === undefined) throw new Error("no tarball produced");
  const manifest = execFileSync("tar", ["-xOf", join(out, tgz), "package/package.json"], {
    encoding: "utf8",
  });
  const pkg = JSON.parse(manifest) as {
    bin?: Record<string, string>;
    dependencies?: Record<string, string>;
  };
  const deps = Object.entries(pkg.dependencies ?? {});
  const bad = deps.filter(([, v]) => v.startsWith("catalog:") || v.startsWith("workspace:"));
  if (bad.length > 0) throw new Error(`unresolved protocols: ${bad.map(([k]) => k).join(", ")}`);
  if (pkg.bin?.zkills !== "dist/cli.js")
    throw new Error(`bin missing or wrong: ${JSON.stringify(pkg.bin)}`);
  console.log(`packcheck: ok (${deps.length} deps pinned, bin present)`);
} finally {
  rmSync(out, { recursive: true, force: true });
}
