// Long names: pax extended header (type x, "len path=value\n") or GNU LongLink (type L)
export function paxPath(data: Buffer): string | undefined {
  let at = 0;
  const text = data.toString("utf8");
  while (at < text.length) {
    const space = text.indexOf(" ", at);
    if (space === -1) return undefined;
    const len = Math.trunc(Number(text.slice(at, space)));
    if (!Number.isFinite(len) || len <= 0) return undefined;
    const record = text.slice(space + 1, at + len);
    if (record.startsWith("path=")) return record.slice(5).replace(/\n$/, "");
    at += len;
  }
  return undefined;
}

export function gnuLongName(data: Buffer): string {
  return data.toString("utf8").replace(/\0.*$/s, "");
}

export const str = (b: Buffer, at: number, len: number): string =>
  b
    .subarray(at, at + len)
    .toString("utf8")
    .replace(/\0.*$/s, "");

export const oct = (b: Buffer, at: number, len: number): number =>
  Number.parseInt(str(b, at, len).trim() || "0", 8);

// ustar name = prefix/name
export function headerName(b: Buffer, at: number): string {
  const prefix = str(b, at + 345, 155);
  const name = str(b, at, 100);
  return prefix.length > 0 ? `${prefix}/${name}` : name;
}
