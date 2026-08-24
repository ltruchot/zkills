import type { CAC } from "cac";
import pc from "picocolors";
import { cacheRoot } from "../io/cache.ts";
import { isOffline } from "../io/net.ts";
import { sourceLabel } from "../io/source.ts";
import { intro, print } from "../io/ui.ts";
import { type GlobalOpts, loadContext } from "./context.ts";

// Flavor, sources, effective policy, links and notes from the preset
export async function runInfo(opts: GlobalOpts): Promise<void> {
  const ctx = await loadContext(opts);
  const { preset } = ctx;
  if (ctx.json) {
    const out = {
      name: preset.name,
      sources: ctx.config.sources,
      policy: ctx.policy,
      conflict: ctx.conflict,
      links: preset.links,
      notes: preset.notes,
    };
    print([JSON.stringify(out, null, 2)]);
    return;
  }
  intro(`${preset.name} info`);
  const lines = [
    `config    ${ctx.p.config}`,
    `cache     ${cacheRoot()}`,
    `offline   ${isOffline() ? pc.yellow("yes") : "no"}`,
    `conflict  ${ctx.conflict}`,
    ...ctx.config.sources.map((s) => `source    ${sourceLabel(s)} (${s.host})`),
    `policy    ${ctx.policy === undefined ? pc.dim("none") : JSON.stringify(ctx.policy)}`,
    ...preset.links.map((l) => `link      ${l.label} ${pc.dim(l.url)}`),
    ...preset.notes.map((n) => `note      ${n}`),
  ];
  print(lines);
}

export function register(cli: CAC): void {
  cli.command("info", "Show flavor, sources, policy, links").action(runInfo);
}
