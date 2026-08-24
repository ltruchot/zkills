import { readBank } from "../core/bank/index.ts";
import type { Skill } from "../core/bank/skill.ts";
import type { Source } from "../core/schema/config.ts";
import { resolveSource } from "../io/source.ts";
import type { Resolved } from "../io/source-local.ts";
import { warn } from "../io/ui.ts";
import type { Ctx } from "./context.ts";

export type Bank = { source: Source; resolved: Resolved; skills: Skill[] };
export type Found = { bank: Bank; skill: Skill };

// Fetch every configured source, skip unreachable ones
export async function loadBanks(ctx: Ctx, strict = true): Promise<Bank[]> {
  const banks: Bank[] = [];
  for (const source of ctx.config.sources) {
    try {
      const token = source.type === "github" ? await ctx.token() : null;
      const resolved = await resolveSource(source, token, ctx.p.root);
      banks.push({ source, resolved, skills: await readBank(resolved.dir) });
    } catch (error) {
      if (strict) throw error;
      warn(`skip ${source.repo}: ${(error as Error).message}`);
    }
  }
  return banks;
}

export function findSkill(banks: Bank[], name: string): Found | undefined {
  for (const bank of banks) {
    const skill = bank.skills.find((s) => s.name === name);
    if (skill !== undefined) return { bank, skill };
  }
  return undefined;
}

export function sourceOf(bank: Bank): { source: string; sourceType: "github" | "local" } {
  return { source: bank.source.repo, sourceType: bank.source.type };
}
