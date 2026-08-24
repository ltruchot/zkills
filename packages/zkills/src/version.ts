import { createRequire } from "node:module";

// Baked by the build, fallback reads package.json when run from source
declare const __ZKILLS_VERSION__: string | undefined;

function fromPackage(): string {
  const require = createRequire(import.meta.url);
  const pkg = require("../package.json") as { version: string };
  return pkg.version;
}

export const VERSION: string =
  typeof __ZKILLS_VERSION__ === "string" ? __ZKILLS_VERSION__ : fromPackage();
