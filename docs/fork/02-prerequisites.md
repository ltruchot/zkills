# Prerequisites

## Rights

- Owner on GitHub org `acme`, or admin on both repos plus packages write
- Ability to create org secrets and fine-grained PAT

## Laptop

- Node 22.18 or newer, `node --version`
- Vite+ global CLI: `npm i -g vite-plus` or `curl -fsSL https://vite.plus | bash`, `vp --version`
- `gh` CLI logged in, `gh auth status`
- git `user.name` and `user.email` set to company identity

## Repo

```bash
git clone https://github.com/ltruchot/zkills.git skills-cli
cd skills-cli
vp install
vp check && vp run lines && vp run -r test && vp run -r build && vp run packcheck && vp run flavorcheck
```

- First run right after `vp install` can fail `EBUSY` on tsgolint, run it twice
- Never `vp run ready`, nesting `vp check` in `vp run` breaks type-aware lint
- Everything green before any change, else fix environment first
- WSL: [../gotchas.md](../gotchas.md), [../gotchas-release.md](../gotchas-release.md)

## Knowledge

- Read [../contract.md](../contract.md), [../config.md](../config.md), [../threat-model.md](../threat-model.md)
- Skim [../commands.md](../commands.md): 12 commands, 5 daily
- Toolchain: Vite+ owns build, test, lint, format, hooks; `vp help`
