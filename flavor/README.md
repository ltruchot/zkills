# Flavor

- White-label hook: fork this repo, drop `flavor/preset.json`, build, publish on your registry
- Preset is baked into `dist/` at build time, no runtime lookup, no dependency on public `zkills`
- Schema: `packages/zkills/src/core/schema/preset.ts`

## Fields

- `name` shown in every intro, e.g. `acme-skills`
- `sources` internal banks: `repo`, `ref`, `path`, `host` (GitHub Enterprise)
- `policy` rules a project cannot weaken: `allowedSources`, `denyFrontmatter`, `requireAudit`
- `conflict` default merge mode
- `links` internal docs, wiki, support channel
- `notes` recommendations printed by `zkills info`

## Steps

- `cp flavor/preset.example.json flavor/preset.json`, edit
- `packages/zkills/package.json`: set `name`, `publishConfig.registry`
- `vp run flavorcheck` builds and proves the baked preset
- Tag, your fork's release workflow publishes to your registry
- Consumers: `npx @acme/zkills init` picks the preset sources, no prompt
