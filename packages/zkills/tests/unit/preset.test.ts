import { expect, test } from "vite-plus/test";
import { mergePolicy } from "../../src/core/policy-merge.ts";
import { Preset } from "../../src/core/schema/preset.ts";

test("preset policy only tightens project policy", () => {
  const preset = {
    allowedSources: ["acme/skills", "acme/more"],
    denyFrontmatter: ["hooks"],
    requireAudit: true,
  };
  const project = {
    allowedSources: ["acme/skills", "evil/skills"],
    denyFrontmatter: ["allowed-tools"],
    requireAudit: false,
  };
  expect(mergePolicy(preset, project)).toStrictEqual({
    allowedSources: ["acme/skills"],
    denyFrontmatter: ["hooks", "allowed-tools"],
    requireAudit: true,
  });
  expect(mergePolicy(undefined, project)).toBe(project);
  expect(mergePolicy(preset)).toBe(preset);
  expect(
    mergePolicy({ requireAudit: false }, { allowedSources: ["x"], requireAudit: false }),
  ).toStrictEqual({
    allowedSources: ["x"],
    requireAudit: false,
  });
});

test("preset schema defaults", () => {
  const p = Preset.parse({ sources: [{ repo: "acme/skills", host: "github.acme.internal" }] });
  expect(p.name).toBe("zkills");
  expect(p.sources?.[0]).toStrictEqual({
    repo: "acme/skills",
    ref: "main",
    path: "skills",
    type: "github",
    host: "github.acme.internal",
  });
  expect(p.links).toStrictEqual([]);
  expect(() => Preset.parse({ conflict: "nope" })).toThrow(/conflict/);
});
