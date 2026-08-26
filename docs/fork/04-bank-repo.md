# Bank repo

## Create

```bash
gh repo create acme/skills --private --description "Claude Code skills bank"
git clone git@github.com:acme/skills.git && cd skills && mkdir skills
cp -r <skills-cli>/packages/zkills/tests/fixtures/bank-v1/skills/hello skills/hello
```

- Layout and rules: [../contract.md](../contract.md)
- No `package.json`, no build, plain files only

## Files at root

- `.gitattributes`: `* text=auto eol=lf`, hashes depend on LF
- `.github/CODEOWNERS`: `skills/ @acme/platform-team`
- `.github/pull_request_template.md`: purpose, project tested on, audit output pasted
- `README.md`: how to author, link to contract, how to request review

## CI on every PR

```yaml
# .github/workflows/lint.yml
on: pull_request
jobs:
  lint:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: read }
    steps:
      - uses: actions/checkout@v4
      - run: echo "@acme:registry=https://npm.pkg.github.com" > ~/.npmrc
      - run: echo "//npm.pkg.github.com/:_authToken=${{ secrets.GITHUB_TOKEN }}" >> ~/.npmrc
      - run: npx --yes @acme/skills-cli@0.3.3 lint skills/*
      - run: npx --yes @acme/skills-cli@0.3.3 audit skills/*
```

- Pin version, bump on purpose
- Package settings → Manage Actions access → add `acme/skills`, else `GITHUB_TOKEN` cannot read package

## Authoring loop

- Branch, edit `skills/<name>/`, `acme-skills lint skills/<name>` locally
- PR, reviewer reads every file, `scripts/` and `references/` too
- Merge = available to every project on next `update`
