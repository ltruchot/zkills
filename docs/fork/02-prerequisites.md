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
vp run ready      # check, lines, test, build, packcheck, flavorcheck
```

- Everything green before any change, else fix environment first
- WSL: [../gotchas.md](../gotchas.md), [../gotchas-release.md](../gotchas-release.md)

## Knowledge

- Read [../contract.md](../contract.md), [../config.md](../config.md), [../threat-model.md](../threat-model.md)
- Skim [../commands.md](../commands.md): 12 commands, 5 daily
- Toolchain: Vite+ owns build, test, lint, format, hooks; `vp help`
