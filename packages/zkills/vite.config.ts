import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig } from "vite-plus";

// Enterprise forks commit flavor/preset.json at the repo root, baked into dist
// ZKILLS_FLAVOR=<file> overrides the path, used by flavorcheck
const override = process.env["ZKILLS_FLAVOR"] ?? "";
const flavor =
  override === "" ? join(import.meta.dirname, "../../flavor/preset.json") : resolve(override);
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
