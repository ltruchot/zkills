import { HOSTS_VAR, isTrustedHost } from "../core/hosts.ts";
import type { Source } from "../core/schema/config.ts";
import { warn } from "../io/ui.ts";
import type { Ctx } from "./context.ts";

// A cloned repo can point a source at any host: the token only follows trusted ones
export function tokenFor(ctx: Ctx, source: Source): Promise<string | null> {
  if (source.type !== "github") return Promise.resolve(null);
  if (isTrustedHost(source.host, ctx.preset)) return ctx.token();
  warn(`${source.host} not trusted, no token sent, set ${HOSTS_VAR}=${source.host}`);
  return Promise.resolve(null);
}
