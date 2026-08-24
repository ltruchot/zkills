import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { formatFindings, jsonFindings } from "../../src/commands/findings.ts";
import { skillFromFiles } from "../../src/core/bank/skill.ts";
import { readSkillsLock } from "../../src/core/interop/skills-lock.ts";
import { checkPolicy } from "../../src/core/policy.ts";
import { MODE_FILE, type FileMap } from "../../src/core/types.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

const fm = (obj: Record<string, string>): FileMap =>
  new Map(Object.entries(obj).map(([k, v]) => [k, { bytes: Buffer.from(v), mode: MODE_FILE }]));

test("findings formatting", () => {
  expect(formatFindings("x", [])[0]).toContain("x");
  const lines = formatFindings("x", [{ rule: "r", level: "warn", file: "f", msg: "m" }]);
  expect(lines[1]).toContain("warn");
  expect(JSON.parse(jsonFindings({ x: [] }))).toStrictEqual({ x: [] });
});

test("policy, skill without SKILL.md, skills-lock tolerance", async () => {
  const skill = skillFromFiles("s", "/s", fm({ "SKILL.md": "---\nname: s\nhooks: []\n---\n" }));
  const source = {
    repo: "o/r",
    ref: "main",
    path: "skills",
    type: "github" as const,
    host: "github.com",
  };
  expect(checkPolicy(undefined, source, skill)).toBeNull();
  expect(checkPolicy({ requireAudit: false }, source, skill)).toBeNull();
  const strict = { allowedSources: ["o/r"], denyFrontmatter: ["hooks"], requireAudit: false };
  expect(checkPolicy(strict, source, skill)).toMatch(/hooks/);
  expect(() => skillFromFiles("s", "/s", fm({}))).toThrow(/SKILL.md/);
  const dir = await tmpDir();
  await writeFile(join(dir, "skills-lock.json"), "{}");
  expect(await readSkillsLock(dir)).toStrictEqual([]);
  await cleanup(dir);
});
