# Fork guide

- Audience: one maintainer at company, sets up internal skills tool once
- Consumers never read this, they run `npx @acme/skills-cli` from internal registry
- Result: private tool repo, private bank repo, package on GitHub Packages, upstream sync local only

## Steps

- [01 How it works](01-how-it-works.md)
- [02 Prerequisites](02-prerequisites.md)
- [03 GitHub org and tool repo](03-github-org.md)
- [04 Bank repo](04-bank-repo.md)
- [05 Rebrand](05-rebrand.md)
- [06 Release on GitHub Packages](06-release.md)
- [07 Rollout to teams](07-rollout.md)
- [08 Upstream sync](08-upstream.md)
- [09 Erase upstream traces](09-erase-traces.md)
- [10 Checklist](10-checklist.md)

## Time

- Half day first time, one hour per upstream sync

## Names used below

- Company `acme`, GitHub org `acme`
- Tool repo `acme/skills-cli`, package `@acme/skills-cli`, bin `acme-skills`
- Bank repo `acme/skills`
- Replace everywhere
