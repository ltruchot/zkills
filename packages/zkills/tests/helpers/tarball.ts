import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";
import { tmpDir } from "./tmp.ts";

// GitHub-shaped tarball: <owner>-<repo>-<sha>/skills/hello/...
export async function fakeBankTarball(): Promise<Buffer> {
  const dir = await tmpDir("zkills-tar-");
  const root = join(dir, "o-r-abc");
  await mkdir(join(root, "skills/hello/scripts"), { recursive: true });
  await mkdir(join(root, "docs"), { recursive: true });
  await writeFile(
    join(root, "skills/hello/SKILL.md"),
    "---\nname: hello\ndescription: hi\n---\nbody\n",
  );
  await writeFile(join(root, "skills/hello/scripts/run.sh"), "#!/bin/sh\n");
  await chmod(join(root, "skills/hello/scripts/run.sh"), 0o755);
  await writeFile(join(root, "docs/README.md"), "not a skill\n");
  const out = join(dir, "bank.tgz");
  await execa("tar", ["-czf", out, "-C", dir, "o-r-abc"]);
  return readFile(out);
}

// Raw ustar header for a malicious entry name
export function ustarHeader(name: string, type = "0"): Buffer {
  const h = Buffer.alloc(512);
  h.write(name, 0, "utf8");
  h.write("0000644\0", 100);
  h.write("00000000000\0", 124);
  h.write(type, 156);
  h.write("ustar\0", 257);
  return h;
}
