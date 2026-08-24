import { gunzipSync } from "node:zlib";
import { type FileMap, MODE_EXEC, MODE_FILE } from "../core/types.ts";

const BLOCK = 512;
export const MAX_ENTRIES = 5000;

const str = (b: Buffer, at: number, len: number): string =>
  b
    .subarray(at, at + len)
    .toString("utf8")
    .replace(/\0.*$/s, "");
const oct = (b: Buffer, at: number, len: number): number =>
  Number.parseInt(str(b, at, len).trim() || "0", 8);

// Reject traversal, absolute paths and empty segments
export function safeRel(name: string): string {
  const parts = name.split("/").filter((p) => p.length > 0);
  if (name.startsWith("/") || parts.some((p) => p === ".." || p === "."))
    throw new Error(`unsafe path in tarball: ${name}`);
  return parts.join("/");
}

// ustar reader: regular files only, symlinks refused, first path segment dropped
export function readTarGz(gz: Buffer, subdir: string): FileMap {
  const tar = gunzipSync(gz);
  const out: FileMap = new Map();
  const prefix = subdir.length === 0 ? "" : `${safeRel(subdir)}/`;
  let at = 0;
  let count = 0;
  while (at + BLOCK <= tar.length && tar[at] !== 0) {
    count += 1;
    if (count > MAX_ENTRIES) throw new Error(`tarball over ${MAX_ENTRIES} entries`);
    const size = oct(tar, at + 124, 12);
    const type = String.fromCodePoint(tar[at + 156] ?? 0);
    const name = safeRel(
      `${str(tar, at + 345, 155)}${str(tar, at + 345, 155) ? "/" : ""}${str(tar, at, 100)}`,
    );
    const rel = name.split("/").slice(1).join("/");
    if (type === "2" || type === "1") throw new Error(`link refused in tarball: ${name}`);
    if ((type === "0" || type === "\0") && rel.startsWith(prefix) && rel.length > prefix.length) {
      const mode = oct(tar, at + 100, 8) & 0o111 ? MODE_EXEC : MODE_FILE;
      out.set(rel.slice(prefix.length), {
        bytes: Buffer.from(tar.subarray(at + BLOCK, at + BLOCK + size)),
        mode,
      });
    }
    at += BLOCK + Math.ceil(size / BLOCK) * BLOCK;
  }
  return out;
}
