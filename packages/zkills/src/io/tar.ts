import { gunzipSync } from "node:zlib";
import { type FileMap, MODE_EXEC, MODE_FILE } from "../core/types.ts";
import { gnuLongName, headerName, oct, paxPath } from "./tar-names.ts";

const BLOCK = 512;
export const MAX_ENTRIES = 5000;
export const MAX_UNPACKED = 200 * 1024 * 1024;

// Reject traversal, absolute paths, backslashes and empty segments
export function safeRel(name: string): string {
  const parts = name.split("/").filter((p) => p.length > 0);
  if (name.startsWith("/") || name.includes("\\") || parts.some((p) => p === ".." || p === "."))
    throw new Error(`unsafe path in tarball: ${name}`);
  return parts.join("/");
}

// ustar and pax reader: regular files only, links refused, first path segment dropped
// gunzip is capped: the 50 MiB download cap says nothing about the expanded size
export function readTarGz(gz: Buffer, subdir: string, maxOut = MAX_UNPACKED): FileMap {
  const tar = gunzipSync(gz, { maxOutputLength: maxOut });
  const out: FileMap = new Map();
  const prefix = subdir.length === 0 ? "" : `${safeRel(subdir)}/`;
  let at = 0;
  let count = 0;
  let longName: string | undefined;
  while (at + BLOCK <= tar.length && tar[at] !== 0) {
    count += 1;
    if (count > MAX_ENTRIES) throw new Error(`tarball over ${MAX_ENTRIES} entries`);
    const size = oct(tar, at + 124, 12);
    const type = String.fromCodePoint(tar[at + 156] ?? 0);
    const data = tar.subarray(at + BLOCK, at + BLOCK + size);
    if (type === "x") longName = paxPath(data);
    else if (type === "L") longName = gnuLongName(data);
    else {
      const name = safeRel(longName ?? headerName(tar, at));
      longName = undefined;
      const rel = name.split("/").slice(1).join("/");
      if (type === "2" || type === "1") throw new Error(`link refused in tarball: ${name}`);
      if ((type === "0" || type === "\0") && rel.startsWith(prefix) && rel.length > prefix.length) {
        const mode = oct(tar, at + 100, 8) & 0o111 ? MODE_EXEC : MODE_FILE;
        out.set(rel.slice(prefix.length), { bytes: Buffer.from(data), mode });
      }
    }
    at += BLOCK + Math.ceil(size / BLOCK) * BLOCK;
  }
  return out;
}
