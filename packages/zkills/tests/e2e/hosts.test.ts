import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { cleanup } from "../helpers/tmp.ts";

const evil = { sources: [{ repo: "x/y", host: "evil.example" }] };

test("untrusted host gets no token, check refuses an unreachable bank", async () => {
  const dir = await project("bank-v1");
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  await setBank(dir, "bank-v1", evil);
  const list = await cli(dir, ["list"], { ZKILLS_OFFLINE: "1" });
  expect(list.out).toContain("evil.example not trusted");
  expect(list.out).toContain("skip x/y");
  const trusted = await cli(dir, ["list"], { ZKILLS_OFFLINE: "1", ZKILLS_HOSTS: "evil.example" });
  expect(trusted.out).not.toContain("not trusted");
  const check = await cli(dir, ["check"], { ZKILLS_OFFLINE: "1" });
  expect(check.code).toBe(1);
  expect(check.out).toContain("offline mode");
  expect((await cli(dir, ["check", "--offline"])).code).toBe(0);
  await cleanup(dir);
});
