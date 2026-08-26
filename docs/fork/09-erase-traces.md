# Erase upstream traces

- Consumers see internal tool from internal registry, nothing else

## Delete

- `docs/fork/`, `docs/enterprise.md`, `flavor/README.md` after setup, copies kept outside repo
- Upstream `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md` content, rewrite for internal process

## Rewrite

- `README.md`: internal tool name, wiki link, support channel, daily commands
- `packages/zkills/README.md`: package page on GitHub Packages
- `packages/zkills/package.json`: `homepage`, `bugs`, `repository` internal
- `CLAUDE.md`: internal repos line
- `LICENSE.md`: keep MIT text and original copyright line, company line added above, license requires it
- `docs/install.md`, `docs/security.md`: internal registry, no public npm mention

## Grep

```bash
grep -rn "ltruchot\|Gods-Academy\|npmjs\|public npm" --include='*.md' --include='*.json' . | grep -v node_modules
```

- Zero hits outside `LICENSE.md` before first rollout
- Technical docs stay, no upstream reference inside

## Keep private

- Upstream sync notes in maintainer wiki, not in repo
