# Changelog

- Newest first, version = git tag `v<version>`

## 0.3.3

- Security: token sent to trusted hosts only, `ZKILLS_HOSTS`
- Security: repo and host shapes validated, cache keyed by host
- Security: gunzip output capped, backslash paths refused, temp JSON removed on failure
- Security: `check` fails on unreachable bank, `update --external` asks before delegating
- Fork: preset name in every intro, hint and help example
- Fork: `flavorcheck` proves example and own preset without touching tree, `ZKILLS_FLAVOR`
- Fork: `packcheck` accepts renamed bin, release publishes any tarball, tag must match version
- Docs: fork guide `docs/fork/`, status reference, security policy, contributing, changelog

## 0.3.2

- `requireAudit` complete, gotchas on partial edits and cancelled releases

## 0.3.1

- Policy `requireAudit` gates `add` and `update`

## 0.3.0

- Help examples, docs rewrite, threat model, pax long names, strict conflict markers
- Env answers over defaults, write allowlist and corner tests

## 0.2.0

- White-label flavor, self-contained bundle, presets, GitHub Enterprise hosts, offline mode

## 0.1.4

- First release through npm trusted publishing

## 0.1.0 to 0.1.3

- Commands init, info, list, add, update, remove, check, doctor, repair, answers, lint, audit
- Strictest TS and oxlint, in-process e2e, public npm package
