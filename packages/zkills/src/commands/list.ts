import type { CAC } from "cac";
import pc from "picocolors";
import { intro, print, spin } from "../io/ui.ts";
import { loadBanks } from "./banks.ts";
import { type GlobalOpts, loadContext } from "./context.ts";
import { listRows, type Row } from "./list-rows.ts";

function color(status: string): string {
  if (status.startsWith("up to date") || status === "available") return pc.green(status);
  if (status.startsWith("external") || status.startsWith("unmanaged")) return pc.yellow(status);
  return pc.red(status);
}

function format(rows: Row[]): string[] {
  const width = Math.max(4, ...rows.map((r) => r.name.length));
  return rows.map((r) => `${r.name.padEnd(width)}  ${color(r.status)}  ${pc.dim(r.where)}`);
}

export async function runList(opts: GlobalOpts): Promise<void> {
  const ctx = await loadContext(opts);
  const banks = ctx.json
    ? await loadBanks(ctx, false)
    : await spin("fetch banks", () => loadBanks(ctx, false));
  const rows = await listRows(ctx, banks);
  if (ctx.json) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }
  intro("zkills list");
  print(format(rows));
}

export function register(cli: CAC): void {
  cli.command("list", "Show bank, installed and external skills").alias("ls").action(runList);
}
