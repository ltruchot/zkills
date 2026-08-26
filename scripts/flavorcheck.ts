// Build with the example flavor, run dist alone, expect the baked preset; same with a fork's own
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();
const OWN = join(ROOT, "flavor", "preset.json");
const EXAMPLE = join(ROOT, "flavor", "preset.example.json");

// ZKILLS_FLAVOR="" = default path, tree never written; vp pack direct, vp run cache ignores env
function build(flavor = ""): void {
  const env = { ...process.env, ZKILLS_FLAVOR: flavor };
  execFileSync("vp", ["pack"], { cwd: join(ROOT, "packages", "zkills"), stdio: "ignore", env });
}

function bakedName(): string {
  const work = mkdtempSync(join(tmpdir(), "zkills-flavor-"));
  try {
    copyFileSync(join(ROOT, "packages", "zkills", "dist", "cli.js"), join(work, "cli.js"));
    writeFileSync(join(work, "zkills.config.json"), '{"version":1,"sources":[{"repo":"x/y"}]}');
    const out = execFileSync("node", ["cli.js", "info", "--json", "--cwd", work], {
      cwd: work,
      encoding: "utf8",
    });
    return (JSON.parse(out) as { name: string }).name;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

try {
  build(EXAMPLE);
  if (bakedName() !== "acme-skills") throw new Error("example flavor not baked into dist");
  if (existsSync(OWN)) {
    build();
    const own = (JSON.parse(readFileSync(OWN, "utf8")) as { name: string }).name;
    if (bakedName() !== own) throw new Error(`own flavor ${own} not baked into dist`);
  }
  console.log("flavorcheck: ok (dist runs alone, preset baked)");
} finally {
  build();
}
