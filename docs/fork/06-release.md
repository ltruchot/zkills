# Release on GitHub Packages

## Workflow

- Edit `.github/workflows/release.yml`: permissions and publish steps below, gates unchanged

```yaml
permissions:
  contents: read
  packages: write
steps:
  # checkout, setup-vp, tag guard, gates, build: same as upstream
  - name: pack
    working-directory: packages/zkills
    run: vp pm pack --pack-destination /tmp/pack
  - name: publish
    working-directory: packages/zkills
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    run: |
      echo "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}" > ~/.npmrc
      npm publish /tmp/pack/*.tgz
```

- Drop `id-token: write` and `npm install -g npm@latest`, trusted publishing unused
- Keep tag guard step, tag must equal `v<version>`

## First release

```bash
git tag v0.3.3 && git push origin v0.3.3
```

- Actions → release job green
- Package under org → Packages, linked to `acme/skills-cli`
- Package → Settings → Manage Actions access → Add repository → `acme/skills` + consumer repos, Read
- UI only, no API; without it CI gets `403 permission_denied: read_package`

## Verify

```bash
echo "@acme:registry=https://npm.pkg.github.com" >> ~/.npmrc
npm view @acme/skills-cli version   # after laptop setup, see 07-rollout
```

## Next releases

- Bump `version` in `packages/zkills/package.json`, line in `CHANGELOG.md`
- PR, merge, tag, push tag
