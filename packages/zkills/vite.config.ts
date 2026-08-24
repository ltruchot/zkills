import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite-plus";

// Enterprise forks drop flavor/preset.json at the repo root, baked into dist
const flavor = join(import.meta.dirname, "../../flavor/preset.json");
const preset = existsSync(flavor) ? JSON.stringify(readFileSync(flavor, "utf8")) : "undefined";
const pkg = JSON.parse(readFileSync(join(import.meta.dirname, "package.json"), "utf8")) as {
  version: string;
};

export default defineConfig({
  pack: {
    entry: ["src/cli.ts"], // single file, dist/cli.js runs alone
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    dts: false, // tsgo spawns EBUSY under WSL, forks build from source anyway
    exports: false,
    define: { __ZKILLS_PRESET__: preset, __ZKILLS_VERSION__: JSON.stringify(pkg.version) },
  },
  test: {
    coverage: {
      include: ["src/**"],
      reporter: ["text-summary", "text"],
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
