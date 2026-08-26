# Contributing

## Setup

- Node 22.18+, `npm i -g vite-plus`, `vp install`
- Gate chain green before first change, see [Testing](docs/testing.md)

## Rules

- Every file under 50 lines, `vp run lines`
- US English, telegraphic bullets, no articles, no trailing punctuation
- No new dependency without catalog pin in `pnpm-workspace.yaml`
- Lint exception = one line in `lint/off-*.ts` with reason
- New friction recorded in `docs/gotchas.md` same change

## Before push

- `vp check` without `--fix`, `vp run lines`, `vp run -r test`, `vp run packcheck`, `vp run flavorcheck`
- Never `git commit --no-verify`

## Pull requests

- One topic per PR, imperative subject
- Tests for every behavior change, docs same PR
- Security bugs: [SECURITY.md](SECURITY.md), never public issue
