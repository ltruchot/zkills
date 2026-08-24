import { defineConfig } from "vite-plus";
import { lint } from "./lint/index.ts";

// Fixtures are test data: never format, never lint
const fixtures = ["packages/zkills/tests/fixtures/**"];

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: { ignorePatterns: fixtures },
  lint,
  run: {
    cache: true,
    tasks: {
      // Style law: every file under 50 lines
      lines: { command: "node scripts/lines.ts", cache: false },
      // Publish safety: pnpm pack must resolve catalog: and keep bin
      packcheck: { command: "node scripts/packcheck.ts", cache: false },
      // White-label proof: example flavor baked, dist runs without node_modules
      flavorcheck: { command: "node scripts/flavorcheck.ts", cache: false },
    },
  },
});
