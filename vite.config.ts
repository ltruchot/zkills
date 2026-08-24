import { defineConfig } from "vite-plus";

// Fixtures are test data: never format, never lint
const fixtures = ["packages/zkills/tests/fixtures/**"];

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: { ignorePatterns: fixtures },
  lint: {
    ignorePatterns: fixtures,
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
    tasks: {
      // Style law: every file under 50 lines
      lines: { command: "node scripts/lines.ts", cache: false },
    },
  },
});
