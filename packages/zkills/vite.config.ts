import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/cli.ts"],
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    dts: false,
    exports: false,
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
