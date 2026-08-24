import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";
import { expect, test } from "vite-plus/test";
import { readTarGz } from "../../src/io/tar.ts";
import { paxPath } from "../../src/io/tar-names.ts";
import { cleanup, tmpDir } from "../helpers/tmp.ts";

// Segments under 100 chars, full path over 100: forces prefix, pax or LongLink
const DEEP = `skills/${"long-".repeat(8)}a/${"deep-".repeat(8)}b`;
const REL = `${DEEP.slice("skills/".length)}/SKILL.md`;

async function archive(format: string): Promise<Buffer> {
  const dir = await tmpDir("zkills-long-");
  await mkdir(join(dir, "root", DEEP), { recursive: true });
  await writeFile(join(dir, "root", DEEP, "SKILL.md"), "deep");
  const out = join(dir, "a.tgz");
  await execa("tar", [`--format=${format}`, "-czf", out, "-C", dir, "root"]);
  const gz = await readFile(out);
  await cleanup(dir);
  return gz;
}

test("paths over 100 chars survive pax, gnu and ustar formats", async () => {
  expect(`root/${DEEP}/SKILL.md`.length).toBeGreaterThan(100);
  for (const format of ["pax", "gnu", "ustar"]) {
    const files = readTarGz(await archive(format), "skills");
    expect([...files.keys()]).toStrictEqual([REL]);
    expect(files.get(REL)?.bytes.toString()).toBe("deep");
  }
});

test("pax record parsing", () => {
  expect(paxPath(Buffer.from("17 path=a/b/c.md\n"))).toBe("a/b/c.md");
  expect(paxPath(Buffer.from("20 mtime=1700000000\n17 path=a/b/c.md\n"))).toBe("a/b/c.md");
  expect(paxPath(Buffer.from("garbage"))).toBeUndefined();
  expect(paxPath(Buffer.from("20 mtime=1700000000\n"))).toBeUndefined();
});
