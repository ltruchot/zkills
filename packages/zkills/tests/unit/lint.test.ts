import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { hasErrors, lintSkill } from "../../src/core/lint/run.ts";
import { FIXTURES } from "../helpers/cli.ts";

test("hello only trips its intentional undeclared token", async () => {
  const findings = await lintSkill(join(FIXTURES, "bank-v1/skills/hello"), { portable: true });
  expect(findings.map((f) => `${f.level}:${f.rule}`)).toEqual(["error:placeholders"]);
  expect(findings[0]?.msg).toContain("NOT_DECLARED");
});

test("bad skill reports name, description, placeholders", async () => {
  const findings = await lintSkill(join(FIXTURES, "bank-bad/skills/Bad_Name"), { portable: true });
  const rules = findings.map((f) => `${f.level}:${f.rule}`);
  expect(rules).toContain("error:name");
  expect(rules).toContain("error:description");
  expect(rules).toContain("error:placeholders");
  expect(rules).toContain("error:frontmatter");
  expect(findings.find((f) => f.rule === "name")?.msg).toMatch(/must equal dir/);
  expect(hasErrors(findings)).toBe(true);
});

test("claude-only key is fine without --portable, missing dir is one error", async () => {
  const findings = await lintSkill(join(FIXTURES, "bank-bad/skills/Bad_Name"), { portable: false });
  expect(findings.filter((f) => f.rule === "frontmatter")).toEqual([]);
  const missing = await lintSkill(join(FIXTURES, "nope"), { portable: false });
  expect(missing.map((f) => f.rule)).toEqual(["read"]);
});
