# Flavor

- White-label hook: fork repo, commit `flavor/preset.json`, build, publish on own registry
- Preset baked into `dist/` at build time, no runtime lookup, no dependency on public `zkills`
- Schema: `packages/zkills/src/core/schema/preset.ts`
- `ZKILLS_FLAVOR=<file>` overrides path at build, `flavorcheck` uses it, tree never written

## Fields

- `name` tool name in every intro, hint and help example, e.g. `acme-skills`
- `sources` internal banks: `repo`, `ref`, `path`, `host`; hosts trusted for token
- `policy` rules project cannot weaken: `allowedSources`, `denyFrontmatter`, `requireAudit`
- `conflict` default merge mode
- `links` internal docs, wiki, support channel
- `notes` recommendations printed by `info`

## Steps

- Full guide: [docs/fork/README.md](../docs/fork/README.md)
- `cp flavor/preset.example.json flavor/preset.json`, edit, commit
- `packages/zkills/package.json`: `name`, `bin`, `publishConfig.registry`
- `vp run flavorcheck` proves example preset and own preset both bake
- Tag, release workflow publishes to own registry
