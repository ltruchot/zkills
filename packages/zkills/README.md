# zkills

- Skills manager for Claude Code, private banks, any GitHub org
- Installs `SKILL.md` dirs into `.claude/skills/`, plain files, committed
- Placeholders asked once per project, 3-way merge on update, atomic writes, backup
- Zero telemetry, zero dependencies, one file

```bash
npx zkills init my-org/skills
npx zkills add qa-pr
npx zkills check --frozen   # CI: 0 ok, 1 update, 2 drift, 3 tamper
```

- Docs: https://github.com/ltruchot/zkills#readme
- License Unlicense, public domain
