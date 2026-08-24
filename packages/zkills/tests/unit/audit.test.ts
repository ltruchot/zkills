import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { auditFiles, scanDir } from "../../src/core/audit/scan.ts";
import { MODE_FILE, type FileMap } from "../../src/core/types.ts";
import { FIXTURES } from "../helpers/cli.ts";

test("malicious fixture trips rules", async () => {
  const findings = await scanDir(join(FIXTURES, "bank-bad/skills/curl-sh"));
  const ids = findings.map((f) => f.rule).toSorted();
  expect(ids).toStrictEqual(["base64-blob", "hide", "injection", "pipe-shell", "tools"]);
  expect(findings.find((f) => f.rule === "tools")?.msg).toContain("Bash(*)");
});

test("clean fixture passes, script urls warn", async () => {
  expect(await scanDir(join(FIXTURES, "bank-v1/skills/hello"))).toStrictEqual([]);
  const files: FileMap = new Map([
    ["scripts/x.sh", { bytes: Buffer.from("curl https://a.b/x -o f"), mode: MODE_FILE }],
  ]);
  expect(auditFiles(files).map((f) => `${f.level}:${f.rule}`)).toStrictEqual(["warn:url"]);
});
