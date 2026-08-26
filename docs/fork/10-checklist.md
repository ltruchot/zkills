# Checklist

## Repos

- [ ] `acme/skills-cli` private, `main` protected, CODEOWNERS
- [ ] `acme/skills` private, `.gitattributes` LF, CODEOWNERS, PR template, lint workflow
- [ ] `upstream` remote local only

## Tool

- [ ] `flavor/preset.json` committed: name, sources, policy, links, notes
- [ ] `package.json`: name, bin, publishConfig, internal URLs, version
- [ ] `vp run ready` green
- [ ] `node dist/cli.js --help` shows `acme-skills`
- [ ] `release.yml` publishes to GitHub Packages with `GITHUB_TOKEN`
- [ ] Tag pushed, package visible, Actions access granted to bank and consumer repos

## Bank

- [ ] First skill passes `lint` and `audit`
- [ ] Reviewer team reads `scripts/` and `references/` on every PR

## Rollout

- [ ] `.npmrc` recipe on wiki
- [ ] `BANK_READ_TOKEN` org secret
- [ ] One pilot project: init, add, `check --frozen` green in CI
- [ ] Wiki and support links in preset

## Traces

- [ ] Grep for upstream names returns only `LICENSE.md`
- [ ] Fork docs deleted from repo, kept outside
