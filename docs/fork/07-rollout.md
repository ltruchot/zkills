# Rollout to teams

## Laptop setup, once per engineer

```bash
gh auth login
echo "@acme:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
npx @acme/skills-cli --version
```

- `gh` token needs `read:packages` and `repo`, `gh auth refresh -s read:packages` when missing
- Classic PAT with same scopes works too
- GitHub Enterprise bank: nothing more, preset host trusted

## First project

```bash
cd my-repo
npx @acme/skills-cli init        # preset bank, no prompt
npx @acme/skills-cli add qa-pr   # placeholders, preview, confirm
git add .claude zkills.config.json && git commit -m "Add qa-pr skill"
```

- Restart Claude Code once, new `.claude/skills` loads at startup
- Never commit `.claude/zkills.local.json`, `init` gitignores it

## Consumer CI

```yaml
- run: echo "@acme:registry=https://npm.pkg.github.com" > ~/.npmrc
- run: echo "//npm.pkg.github.com/:_authToken=${{ secrets.GITHUB_TOKEN }}" >> ~/.npmrc
- run: npx --yes @acme/skills-cli@0.3.3 check --frozen
  env:
    ZKILLS_TOKEN: ${{ secrets.BANK_READ_TOKEN }}
```

- `BANK_READ_TOKEN` org secret: fine-grained PAT, contents read on `acme/skills`, or GitHub App token
- Package Actions access granted to consumer repo, see [06-release.md](06-release.md)
- Exit codes: [../status.md](../status.md)

## Internal docs

- Wiki page: install, daily commands, who to ask; linked from preset `links`
- Support channel in preset `links`, `acme-skills info` prints both
